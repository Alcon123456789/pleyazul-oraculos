'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, CreditCard } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function TestCheckoutPage() {
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderIdParam = searchParams.get('order_id');
    if (orderIdParam) {
      setOrderId(orderIdParam);
    } else {
      router.push('/tiradas');
    }
  }, [searchParams, router]);

  const handleMockPayment = async () => {
    if (!orderId) return;
    
    setProcessing(true);
    
    try {
      const response = await fetch('/api/paypal/mock-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Pago simulado completado exitosamente');
        router.push(`/lectura/${orderId}`);
      } else {
        toast.error(data.error || 'Error procesando el pago de prueba');
      }
    } catch (error) {
      console.error('Mock payment error:', error);
      toast.error('Error de conexión');
    } finally {
      setProcessing(false);
    }
  };

  if (!orderId) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <Clock className="w-8 h-8 mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 bg-yellow-500 rounded-full text-white mb-4 w-fit">
            <CreditCard className="w-8 h-8" />
          </div>
          <CardTitle className="text-xl text-slate-800">🧪 Modo de Prueba</CardTitle>
          <CardDescription>
            Esta es una simulación de pago para propósitos de demostración
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-slate-800 mb-2">Detalles de la orden:</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>ID de orden:</span>
                <span className="font-mono">{orderId.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span>Monto:</span>
                <span className="font-bold">€19.99</span>
              </div>
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className="text-amber-600">Pendiente de pago</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Al hacer clic en "Simular Pago", tu lectura será generada 
              automáticamente y estará disponible inmediatamente.
            </p>
          </div>
          
          <Button 
            onClick={handleMockPayment}
            disabled={processing}
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {processing ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Simular Pago Exitoso
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => router.push('/tiradas')}
            className="w-full"
          >
            Cancelar y volver
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}