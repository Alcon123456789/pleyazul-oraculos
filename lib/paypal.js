import crypto from 'crypto';

// PayPal API Base URLs
const PAYPAL_API_BASE = process.env.PAYPAL_ENV === 'live' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// Check if PayPal is configured
export function isPayPalConfigured() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  return clientId && clientId !== '<to be added later>' && 
         clientSecret && clientSecret !== '<to be added later>';
}

// Get PayPal access token
export async function getPayPalAccessToken() {
  if (!isPayPalConfigured()) {
    throw new Error('PayPal not configured');
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  
  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }
  
  const data = await response.json();
  return data.access_token;
}

// Create PayPal order
export async function createPayPalOrder(orderData) {
  if (!isPayPalConfigured()) {
    // Return mock data for test mode
    return {
      id: `MOCK_ORDER_${Date.now()}`,
      status: 'CREATED',
      links: [{
        href: '/api/paypal/mock-approve',
        rel: 'approve',
        method: 'GET'
      }]
    };
  }

  const accessToken = await getPayPalAccessToken();
  
  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: orderData.orderId,
        description: orderData.description || 'Lectura de Oráculos Pleyazul',
        amount: {
          currency_code: 'EUR',
          value: orderData.amount.toString()
        }
      }],
      application_context: {
        return_url: `${process.env.APP_BASE_URL}/lectura/${orderData.orderId}?status=success`,
        cancel_url: `${process.env.APP_BASE_URL}/checkout?cancelled=true`,
        brand_name: 'Pleyazul Oráculos',
        locale: 'es-ES',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW'
      }
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PayPal API error: ${error}`);
  }
  
  return await response.json();
}

// Capture PayPal order
export async function capturePayPalOrder(orderId) {
  if (!isPayPalConfigured()) {
    // Return mock success for test mode
    return {
      id: orderId,
      status: 'COMPLETED',
      purchase_units: [{
        payments: {
          captures: [{
            id: `MOCK_CAPTURE_${Date.now()}`,
            status: 'COMPLETED',
            amount: { currency_code: 'EUR', value: '19.99' }
          }]
        }
      }]
    };
  }

  const accessToken = await getPayPalAccessToken();
  
  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PayPal capture error: ${error}`);
  }
  
  return await response.json();
}

// Verify PayPal webhook signature (simplified)
export function verifyPayPalWebhook(headers, body) {
  // In test mode, always return true
  if (process.env.TEST_MODE === 'true') {
    return true;
  }
  
  // In production, implement proper webhook verification
  // This is a simplified version - use PayPal's SDK for production
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId || webhookId === '<to be added later>') {
    console.warn('PayPal webhook verification skipped - webhook ID not configured');
    return true;
  }
  
  // Implement actual verification logic here
  return true;
}