'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Shield, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const [spreads, setSpreads] = useState({});
  const [selectedSpread, setSelectedSpread] = useState('');
  const [email, setEmail] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Load spreads
    fetch('/api/content/spreads')
      .then(res => res.json())
      .then(data => setSpreads(data || {}))
      .catch(err => console.error('Error loading spreads:', err));

    // Pre-fill from URL params
    const spreadId = searchParams.get('spread_id');
    const emailParam = searchParams.get('email');
    
    if (spreadId) setSelectedSpread(spreadId);
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const getOracleInfo = (oraculo) => {
    const info = {
      tarot: { name: 'Tarot', color: 'bg-purple-100 text-purple-800' },
      iching: { name: 'I Ching', color: 'bg-emerald-100 text-emerald-800' },
      rueda: { name: 'Rueda Medicinal', color: 'bg-amber-100 text-amber-800' }
    };
    return info[oraculo] || { name: oraculo, color: 'bg-gray-100 text-gray-800' };
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!email || !selectedSpread) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          spread_id: selectedSpread,
          custom_question: customQuestion
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.test_mode) {
          toast.success('Orden creada en modo de prueba');
          router.push(`/checkout/test?order_id=${data.order_id}`);
        } else if (data.approval_url) {
          window.location.href = data.approval_url;
        } else {
          toast.error('Error en la configuración de pago');
        }
      } else {
        toast.error(data.error || 'Error creando la orden');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const selectedSpreadData = spreads[selectedSpread];
  const oracleInfo = selectedSpreadData ? getOracleInfo(selectedSpreadData.oraculo) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/tiradas">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a tiradas
          </Link>
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Finalizar Pedido</h1>
          <p className="text-slate-600">Completa tu consulta oracular</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Order Summary */}
        {selectedSpreadData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Resumen del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={oracleInfo.color}>
                    {oracleInfo.name}
                  </Badge>
                  <div>
                    <div className="font-medium">
                      {selectedSpreadData.posiciones ? 
                        selectedSpreadData.posiciones.join(' • ') : 
                        `Consulta ${oracleInfo.name}`
                      }
                    </div>
                    <div className="text-sm text-slate-600">
                      {selectedSpreadData.cartas} {
                        selectedSpreadData.oraculo === 'iching' ? 'hexagrama' : 
                        selectedSpreadData.oraculo === 'rueda' ? 'animales' : 'cartas'
                      }
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">€19.99</div>
                  <div className="text-xs text-slate-500">Incluye PDF</div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">✨ Incluye:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Interpretación completa y personalizada</li>
                  <li>• PDF descargable con tu consulta</li>
                  <li>• Acceso permanente en línea</li>
                  <li>• Envío opcional por Telegram</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Checkout Form */}
        <Card>
          <CardHeader>
            <CardTitle>Datos de Contacto</CardTitle>
            <CardDescription>
              Información necesaria para enviarte tu lectura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Recibirás tu lectura en este email
                </p>
              </div>

              {!selectedSpread && (
                <div>
                  <Label htmlFor="spread">Tipo de Consulta *</Label>
                  <select
                    id="spread"
                    value={selectedSpread}
                    onChange={(e) => setSelectedSpread(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                    required
                  >
                    <option value="">Selecciona una consulta</option>
                    {Object.entries(spreads).map(([id, spread]) => {
                      const info = getOracleInfo(spread.oraculo);
                      return (
                        <option key={id} value={id}>
                          {info.name} - {spread.posiciones ? spread.posiciones.join(' • ') : `${spread.cartas} cartas`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
              
              <div>
                <Label htmlFor="question">Tu pregunta o intención (opcional)</Label>
                <Textarea
                  id="question"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Escribe tu pregunta específica o la intención de tu consulta..."
                  rows={3}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Esto ayudará a personalizar tu interpretación
                </p>
              </div>
              
              <Separator />
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-800 mb-2">Total a pagar:</h4>
                <div className="flex justify-between items-center">
                  <span className="text-lg">Consulta oracular completa</span>
                  <span className="text-2xl font-bold text-slate-800">€19.99</span>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={!selectedSpread || !email || loading}
              >
                {loading ? 'Procesando...' : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceder al Pago con PayPal
                  </>
                )}
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Shield className="w-4 h-4" />
                <span>Pago seguro protegido por PayPal</span>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security & Terms */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <h4 className="font-medium text-blue-800">Pago Seguro</h4>
              </div>
              <p className="text-sm text-blue-700">
                Utilizamos PayPal para procesar pagos de forma segura. 
                Tu información financiera está protegida.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <h4 className="font-medium text-green-800">Satisfacción</h4>
              </div>
              <p className="text-sm text-green-700">
                Generamos tu lectura inmediatamente después del pago. 
                Acceso permanente garantizado.
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-slate-500 text-center">
          Al proceder aceptas nuestros{' '}
          <Link href="/legal/terminos" className="text-blue-600 hover:underline">
            Términos y Condiciones
          </Link>{' '}
          y{' '}
          <Link href="/legal/privacidad" className="text-blue-600 hover:underline">
            Política de Privacidad
          </Link>
        </p>
      </div>
    </div>
  );
}