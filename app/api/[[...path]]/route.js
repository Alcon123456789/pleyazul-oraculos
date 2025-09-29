import { NextResponse } from 'next/server';
import { connectToDatabase, getCollection } from '@/lib/mongodb';
import contentService from '@/lib/contentService';
import { sendTelegramMessage, isTelegramConfigured } from '@/lib/telegram';
import { createPayPalOrder, capturePayPalOrder, verifyPayPalWebhook, isPayPalConfigured } from '@/lib/paypal';
import { generateReadingPDF } from '@/lib/pdfGenerator';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.CORS_ORIGINS || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Main API handler
export async function GET(request, { params }) {
  try {
    const path = params.path ? params.path.join('/') : '';
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Route handling
    switch (path) {
      // System status
      case '':
      case 'status':
        return NextResponse.json({
          status: 'ok',
          service: 'Pleyazul Oráculos API',
          timestamp: new Date().toISOString(),
          integrations: {
            paypal: isPayPalConfigured(),
            telegram: isTelegramConfigured(),
            testMode: process.env.TEST_MODE === 'true'
          }
        }, { headers: corsHeaders });

      // Content endpoints
      case 'content/tarot':
        return NextResponse.json(contentService.loadContent('tarot'), { headers: corsHeaders });
      
      case 'content/iching':
        return NextResponse.json(contentService.loadContent('iching'), { headers: corsHeaders });
      
      case 'content/rueda':
        return NextResponse.json(contentService.loadContent('rueda'), { headers: corsHeaders });
      
      case 'content/spreads':
        return NextResponse.json(contentService.loadContent('spreads'), { headers: corsHeaders });
      
      case 'content/presets':
        return NextResponse.json(contentService.loadContent('presets'), { headers: corsHeaders });
      
      case 'content/meditaciones':
        return NextResponse.json(contentService.loadContent('meditaciones'), { headers: corsHeaders });

      // Schema endpoints
      case 'content/schema/tarot':
        return NextResponse.json(contentService.loadSchema('tarot'), { headers: corsHeaders });
      
      case 'content/schema/iching':
        return NextResponse.json(contentService.loadSchema('iching'), { headers: corsHeaders });
      
      case 'content/schema/rueda':
        return NextResponse.json(contentService.loadSchema('rueda'), { headers: corsHeaders });
      
      case 'content/schema/spreads':
        return NextResponse.json(contentService.loadSchema('spreads'), { headers: corsHeaders });
      
      case 'content/schema/presets':
        return NextResponse.json(contentService.loadSchema('presets'), { headers: corsHeaders });
      
      case 'content/schema/meditaciones':
        return NextResponse.json(contentService.loadSchema('meditaciones'), { headers: corsHeaders });

      // Orders
      case 'orders':
        const ordersCollection = await getCollection('orders');
        const orders = await ordersCollection.find({}).sort({ created_at: -1 }).limit(50).toArray();
        return NextResponse.json(orders, { headers: corsHeaders });

      // Single order
      default:
        if (path.startsWith('orders/')) {
          const orderId = path.split('/')[1];
          const ordersCollection = await getCollection('orders');
          const order = await ordersCollection.findOne({ order_id: orderId });
          
          if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404, headers: corsHeaders });
          }
          
          // Also get reading if it exists
          const readingsCollection = await getCollection('readings');
          const reading = await readingsCollection.findOne({ order_id: orderId });
          
          return NextResponse.json({ order, reading }, { headers: corsHeaders });
        }
        
        if (path.startsWith('readings/')) {
          const orderId = path.split('/')[1];
          const readingsCollection = await getCollection('readings');
          const reading = await readingsCollection.findOne({ order_id: orderId });
          
          if (!reading) {
            return NextResponse.json({ error: 'Reading not found' }, { status: 404, headers: corsHeaders });
          }
          
          return NextResponse.json(reading, { headers: corsHeaders });
        }
        
        if (path === 'admin/setup-status') {
          return NextResponse.json({
            paypal_configured: isPayPalConfigured(),
            telegram_configured: isTelegramConfigured(),
            test_mode: process.env.TEST_MODE === 'true',
            admin_password_set: !!process.env.ADMIN_PASSWORD,
            webhooks: {
              paypal_url: `${process.env.APP_BASE_URL}/api/webhooks/paypal`,
              telegram_url: `${process.env.APP_BASE_URL}/api/webhooks/telegram`
            }
          }, { headers: corsHeaders });
        }
        
        return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
    }
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const path = params.path ? params.path.join('/') : '';
    const body = await request.json();

    switch (path) {
      // Create order and checkout
      case 'checkout':
        const { email, spread_id, custom_question } = body;
        
        if (!email || !spread_id) {
          return NextResponse.json(
            { error: 'Email and spread_id are required' },
            { status: 400, headers: corsHeaders }
          );
        }
        
        // Validate spread exists
        const spreads = contentService.loadContent('spreads');
        if (!spreads[spread_id]) {
          return NextResponse.json(
            { error: 'Invalid spread_id' },
            { status: 400, headers: corsHeaders }
          );
        }
        
        const orderId = uuidv4();
        const orderData = {
          order_id: orderId,
          email,
          spread_id,
          custom_question: custom_question || '',
          status: 'created',
          amount: 19.99, // Fixed price for now
          created_at: new Date(),
          test_mode: process.env.TEST_MODE === 'true'
        };
        
        // Save order to database
        const ordersCollection = await getCollection('orders');
        await ordersCollection.insertOne(orderData);
        
        // Create PayPal order
        try {
          const paypalOrder = await createPayPalOrder({
            orderId: orderId,
            amount: orderData.amount,
            description: `Lectura ${spread_id} - Pleyazul Oráculos`
          });
          
          // Update order with PayPal order ID
          await ordersCollection.updateOne(
            { order_id: orderId },
            { $set: { paypal_order_id: paypalOrder.id, paypal_status: paypalOrder.status } }
          );
          
          return NextResponse.json({
            success: true,
            order_id: orderId,
            paypal_order: paypalOrder,
            approval_url: paypalOrder.links?.find(link => link.rel === 'approve')?.href
          }, { headers: corsHeaders });
          
        } catch (paypalError) {
          console.error('PayPal error:', paypalError);
          
          // If PayPal fails but we're in test mode, continue with mock payment
          if (process.env.TEST_MODE === 'true') {
            return NextResponse.json({
              success: true,
              order_id: orderId,
              test_mode: true,
              message: 'Order created in test mode',
              mock_payment_url: `/api/paypal/mock-payment/${orderId}`
            }, { headers: corsHeaders });
          }
          
          throw paypalError;
        }

      // Generate reading
      case 'readings/generate':
        const { order_id } = body;
        
        if (!order_id) {
          return NextResponse.json(
            { error: 'Order ID is required' },
            { status: 400, headers: corsHeaders }
          );
        }
        
        // Get order
        const ordersCol = await getCollection('orders');
        const order = await ordersCol.findOne({ order_id });
        
        if (!order) {
          return NextResponse.json(
            { error: 'Order not found' },
            { status: 404, headers: corsHeaders }
          );
        }
        
        // Check if reading already exists
        const readingsCol = await getCollection('readings');
        const existingReading = await readingsCol.findOne({ order_id });
        
        if (existingReading) {
          return NextResponse.json(existingReading, { headers: corsHeaders });
        }
        
        // Generate new reading
        const reading = contentService.generateReading(order_id, order.email, order.spread_id);
        
        const readingData = {
          _id: uuidv4(),
          order_id,
          result_json: reading,
          created_at: new Date(),
          delivered_at: null,
          pdf_url: null
        };
        
        // Save reading
        await readingsCol.insertOne(readingData);
        
        // Update order status
        await ordersCol.updateOne(
          { order_id },
          { $set: { status: 'completed', completed_at: new Date() } }
        );
        
        // Generate PDF
        const pdfResult = await generateReadingPDF(reading, order);
        if (pdfResult.success) {
          await readingsCol.updateOne(
            { order_id },
            { $set: { pdf_url: pdfResult.pdfUrl } }
          );
        }
        
        return NextResponse.json({
          success: true,
          reading: readingData,
          pdf_url: pdfResult.pdfUrl
        }, { headers: corsHeaders });

      // Send reading via Telegram
      case 'telegram/send-reading':
        const { order_id: telegramOrderId, chat_id } = body;
        
        if (!telegramOrderId || !chat_id) {
          return NextResponse.json(
            { error: 'Order ID and chat_id are required' },
            { status: 400, headers: corsHeaders }
          );
        }
        
        const readingCol = await getCollection('readings');
        const telegramReading = await readingCol.findOne({ order_id: telegramOrderId });
        
        if (!telegramReading) {
          return NextResponse.json(
            { error: 'Reading not found' },
            { status: 404, headers: corsHeaders }
          );
        }
        
        // Format reading for Telegram
        const message = formatReadingForTelegram(telegramReading.result_json, telegramOrderId);
        
        const result = await sendTelegramMessage(chat_id, message, 'MarkdownV2');
        
        if (result.success) {
          await readingCol.updateOne(
            { order_id: telegramOrderId },
            { $set: { delivered_at: new Date(), telegram_sent: true } }
          );
        }
        
        return NextResponse.json(result, { headers: corsHeaders });

      // Admin content updates
      case 'admin/content':
        const { type, content } = body;
        const password = request.headers.get('Authorization')?.replace('Bearer ', '');
        
        if (password !== process.env.ADMIN_PASSWORD) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401, headers: corsHeaders }
          );
        }
        
        const saved = contentService.saveContent(type, content);
        
        if (saved) {
          return NextResponse.json({ success: true }, { headers: corsHeaders });
        } else {
          return NextResponse.json(
            { error: 'Failed to save content' },
            { status: 500, headers: corsHeaders }
          );
        }

      // Mock PayPal payment for testing
      case 'paypal/mock-payment':
        if (process.env.TEST_MODE !== 'true') {
          return NextResponse.json(
            { error: 'Mock payment only available in test mode' },
            { status: 403, headers: corsHeaders }
          );
        }
        
        const mockOrderId = body.order_id;
        
        // Generate reading automatically for test orders
        const generateResponse = await fetch(`${request.url.origin}/api/readings/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: mockOrderId })
        });
        
        const generateData = await generateResponse.json();
        
        return NextResponse.json({
          success: true,
          message: 'Mock payment completed',
          reading_generated: generateData.success,
          redirect_url: `/lectura/${mockOrderId}`
        }, { headers: corsHeaders });

      default:
        return NextResponse.json(
          { error: 'Endpoint not found' },
          { status: 404, headers: corsHeaders }
        );
    }
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Webhook handlers
export async function PUT(request, { params }) {
  try {
    const path = params.path ? params.path.join('/') : '';
    
    if (path.startsWith('webhooks/')) {
      const webhookType = path.split('/')[1];
      
      if (webhookType === 'paypal') {
        const body = await request.text();
        const headers = Object.fromEntries(request.headers.entries());
        
        // Verify webhook (simplified)
        if (!verifyPayPalWebhook(headers, body)) {
          return NextResponse.json(
            { error: 'Invalid webhook signature' },
            { status: 401, headers: corsHeaders }
          );
        }
        
        const event = JSON.parse(body);
        
        if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
          const resource = event.resource;
          const orderId = resource.supplementary_data?.related_ids?.order_id;
          
          if (orderId) {
            // Find our internal order
            const ordersCol = await getCollection('orders');
            const order = await ordersCol.findOne({ paypal_order_id: orderId });
            
            if (order) {
              // Update order status
              await ordersCol.updateOne(
                { order_id: order.order_id },
                { $set: { status: 'paid', paid_at: new Date() } }
              );
              
              // Generate reading
              const reading = contentService.generateReading(order.order_id, order.email, order.spread_id);
              
              const readingsCol = await getCollection('readings');
              await readingsCol.insertOne({
                _id: uuidv4(),
                order_id: order.order_id,
                result_json: reading,
                created_at: new Date()
              });
            }
          }
        }
        
        return NextResponse.json({ status: 'ok' }, { headers: corsHeaders });
      }
      
      if (webhookType === 'telegram') {
        const update = await request.json();
        
        // Simple telegram bot handler
        if (update.message) {
          const { message } = update;
          const chatId = message.chat.id;
          const text = message.text || '';
          
          if (text.startsWith('/start')) {
            await sendTelegramMessage(
              chatId,
              '¡Bienvenido a Pleyazul Oráculos! 🔮\n\nPuedes recibir tus lecturas directamente aquí después de realizar tu pago.\n\nVisita nuestro sitio web para hacer una consulta.'
            );
          }
        }
        
        return NextResponse.json({ status: 'ok' }, { headers: corsHeaders });
      }
    }
    
    return NextResponse.json(
      { error: 'Webhook not found' },
      { status: 404, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Helper function to format reading for Telegram
function formatReadingForTelegram(reading, orderId) {
  let message = `🔮 *Tu lectura Pleyazul está lista*\n\n`;
  
  if (reading.type === 'tarot') {
    message += `*Lectura de Tarot*\n\n`;
    reading.cards.forEach((card, index) => {
      message += `*${card.position}*\n`;
      message += `${card.name} ${card.reversed ? '\(Invertida\)' : ''}\n`;
      message += `${card.interpretation}\n\n`;
    });
  } else if (reading.type === 'iching') {
    message += `*Consulta del I Ching*\n\n`;
    message += `*Hexagrama ${reading.hexagram.hex}: ${reading.hexagram.nombre}*\n\n`;
    message += `${reading.hexagram.consejo}\n\n`;
  } else if (reading.type === 'rueda') {
    message += `*Medicina de la Rueda Sagrada*\n\n`;
    reading.animals.forEach((animal, index) => {
      message += `*${animal.position}*\n`;
      message += `${animal.animal} \- ${animal.arquetipo}\n`;
      message += `${animal.medicina}\n\n`;
    });
  }
  
  message += `✨ *${reading.message}*\n\n`;
  message += `Ver lectura completa: ${process.env.APP_BASE_URL}/lectura/${orderId}`;
  
  return message;
}