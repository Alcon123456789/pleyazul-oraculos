'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Eye, Stars, Compass, Download, Send, Clock, CheckCircle, 
  AlertCircle, ArrowLeft, Copy, MessageCircle 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LecturaPage({ params }) {
  const [orderData, setOrderData] = useState(null);
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [telegramChatId, setTelegramChatId] = useState('');
  const [sendingTelegram, setSendingTelegram] = useState(false);
  const orderId = params.order_id;

  useEffect(() => {
    if (orderId) {
      fetchOrderAndReading();
    }
  }, [orderId]);

  const fetchOrderAndReading = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();

      if (data.order) {
        setOrderData(data.order);
        setReading(data.reading);
        
        // If order is paid but no reading exists, try to generate it
        if (data.order.status === 'paid' && !data.reading) {
          await generateReading();
        }
      } else {
        toast.error('Orden no encontrada');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Error cargando la lectura');
    } finally {
      setLoading(false);
    }
  };

  const generateReading = async () => {
    try {
      const response = await fetch('/api/readings/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      const data = await response.json();

      if (data.success) {
        setReading(data.reading);
        toast.success('Lectura generada exitosamente');
      }
    } catch (error) {
      console.error('Error generating reading:', error);
    }
  };

  const sendToTelegram = async () => {
    if (!telegramChatId) {
      toast.error('Por favor ingresa tu Chat ID de Telegram');
      return;
    }

    setSendingTelegram(true);
    
    try {
      const response = await fetch('/api/telegram/send-reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: orderId,
          chat_id: parseInt(telegramChatId, 10)
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Lectura enviada a Telegram exitosamente');
      } else {
        toast.error(data.error || 'Error enviando a Telegram');
      }
    } catch (error) {
      console.error('Error sending to Telegram:', error);
      toast.error('Error de conexión');
    } finally {
      setSendingTelegram(false);
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    toast.success('ID de orden copiado');
  };

  const getOracleIcon = (type) => {
    const icons = {
      tarot: <Eye className="w-5 h-5" />,
      iching: <Stars className="w-5 h-5" />,
      rueda: <Compass className="w-5 h-5" />
    };
    return icons[type] || <Eye className="w-5 h-5" />;
  };

  const renderReading = () => {
    if (!reading) return null;

    const readingData = reading.result_json;

    if (readingData.type === 'tarot') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Lectura de Tarot</h2>
            <p className="text-slate-600">{readingData.message}</p>
          </div>
          
          <div className="grid gap-4">
            {readingData.cards.map((card, index) => (
              <Card key={index} className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline" className="text-purple-700">
                      {card.position}
                    </Badge>
                    <span>{card.name}</span>
                    {card.reversed && (
                      <Badge variant="secondary" className="text-xs">
                        Invertida
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {card.image && (
                      <div className="flex justify-center mb-4">
                        <img 
                          src={card.image} 
                          alt={card.name}
                          className={`w-24 h-40 object-cover rounded-lg shadow-md ${card.reversed ? 'transform rotate-180' : ''}`}
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-slate-800">Significado:</h4>
                      <p className="text-slate-600">{card.interpretation}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">Consejo:</h4>
                      <p className="text-slate-600">{card.advice}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (readingData.type === 'iching') {
      const hex = readingData.hexagram;
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Consulta del I Ching</h2>
            <p className="text-slate-600">{readingData.message}</p>
          </div>
          
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-center">
                Hexagrama {hex.hex}: {hex.nombre}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-800">Palabras Clave:</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {hex.palabras_clave.map((palabra, index) => (
                    <Badge key={index} variant="outline">
                      {palabra}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-800">Juicio:</h4>
                <p className="text-slate-600">{hex.juicio}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-800">Imagen:</h4>
                <p className="text-slate-600">{hex.imagen}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-800">Consejo:</h4>
                <p className="text-slate-600 font-medium">{hex.consejo}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (readingData.type === 'rueda') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Medicina de la Rueda Sagrada</h2>
            <p className="text-slate-600">{readingData.message}</p>
          </div>
          
          <div className="grid gap-4">
            {readingData.animals.map((animal, index) => (
              <Card key={index} className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline" className="text-amber-700">
                      {animal.position}
                    </Badge>
                    <span>{animal.animal} - {animal.arquetipo}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-700">Luz:</h4>
                    <p className="text-slate-600">{animal.luz}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-red-700">Sombra:</h4>
                    <p className="text-slate-600">{animal.sombra}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-800">Medicina:</h4>
                    <p className="text-slate-600">{animal.medicina}</p>
                  </div>
                  
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-1">Afirmación:</h4>
                    <p className="text-amber-700 font-medium italic">{animal.afirmacion}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <Clock className="w-8 h-8 mx-auto mb-4 text-slate-400 animate-spin" />
          <p className="text-slate-600">Cargando tu lectura...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Orden no encontrada</h2>
        <p className="text-slate-600 mb-6">La orden solicitada no existe o ha expirado.</p>
        <Button asChild>
          <Link href="/tiradas">Solicitar Nueva Lectura</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </Button>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-800">Tu Lectura</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-slate-600">Orden:</span>
            <code className="text-sm bg-slate-100 px-2 py-1 rounded">{orderId.slice(0, 8)}...</code>
            <Button variant="ghost" size="sm" onClick={copyOrderId}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Order Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {orderData.status === 'completed' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Clock className="w-6 h-6 text-amber-600" />
              )}
              
              <div>
                <div className="font-medium text-slate-800">
                  {orderData.status === 'completed' ? 'Lectura Completada' : 'Procesando...'}
                </div>
                <div className="text-sm text-slate-600">
                  {new Date(orderData.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
            
            {orderData.test_mode && (
              <Badge variant="secondary">🧪 Modo Test</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reading Content */}
      {reading ? (
        <div className="space-y-6">
          {renderReading()}
          
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                {reading.pdf_url && (
                  <Button asChild variant="outline">
                    <a href={reading.pdf_url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar PDF
                    </a>
                  </Button>
                )}
                
                <Button variant="outline" onClick={() => window.print()}>
                  <Download className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
              </div>
              
              <Separator />
              
              {/* Telegram Integration */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-800">Enviar a Telegram</h4>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="telegram-chat-id" className="text-sm">Chat ID</Label>
                    <Input
                      id="telegram-chat-id"
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      placeholder="123456789"
                      type="number"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={sendToTelegram}
                      disabled={sendingTelegram || !telegramChatId}
                      size="sm"
                    >
                      {sendingTelegram ? (
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Enviar
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Para obtener tu Chat ID, envía /start a nuestro bot de Telegram.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Preparando tu lectura...
            </h3>
            <p className="text-slate-600 mb-4">
              Tu consulta está siendo procesada. Esto puede tomar unos momentos.
            </p>
            <Button onClick={fetchOrderAndReading} variant="outline">
              Actualizar
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Footer */}
      <div className="text-center text-xs text-slate-500 pt-8 border-t border-slate-200">
        <p>
          <strong>Disclaimer:</strong> Este servicio es de carácter espiritual y recreativo. 
          No sustituye el asesoramiento médico, legal o profesional.
        </p>
      </div>
    </div>
  );
}