'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Eye, Stars, Compass, Sparkles, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function TiradasPage() {
  const [spreads, setSpreads] = useState({});
  const [presets, setPresets] = useState([]);
  const [selectedSpread, setSelectedSpread] = useState('');
  const [email, setEmail] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load spreads and presets
    Promise.all([
      fetch('/api/content/spreads').then(res => res.json()),
      fetch('/api/content/presets').then(res => res.json())
    ])
    .then(([spreadsData, presetsData]) => {
      setSpreads(spreadsData || {});
      setPresets(presetsData || []);
    })
    .catch(err => {
      console.error('Error loading data:', err);
      toast.error('Error cargando las tiradas disponibles');
    });
  }, []);

  const getOracleInfo = (oraculo) => {
    const info = {
      tarot: { name: 'Tarot', icon: <Eye className="w-5 h-5" />, color: 'bg-purple-100 text-purple-800' },
      iching: { name: 'I Ching', icon: <Stars className="w-5 h-5" />, color: 'bg-emerald-100 text-emerald-800' },
      rueda: { name: 'Rueda Medicinal', icon: <Compass className="w-5 h-5" />, color: 'bg-amber-100 text-amber-800' }
    };
    return info[oraculo] || { name: oraculo, icon: <Sparkles className="w-5 h-5" />, color: 'bg-gray-100 text-gray-800' };
  };

  const handleSelectPreset = (preset) => {
    setSelectedSpread(preset.tirada_id);
    setCustomQuestion(preset.label);
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
          // In test mode, redirect to mock payment
          toast.success('Orden creada en modo de prueba');
          router.push(`/checkout/test?order_id=${data.order_id}`);
        } else if (data.approval_url) {
          // Redirect to PayPal
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
        
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Tiradas Disponibles</h1>
          <p className="text-slate-600">Elige la consulta perfecta para tu búsqueda espiritual</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Spreads */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Tipos de Consulta</h2>
            
            <div className="grid gap-3">
              {Object.entries(spreads).map(([id, spread]) => {
                const oracleInfo = getOracleInfo(spread.oraculo);
                const isSelected = selectedSpread === id;
                
                return (
                  <Card 
                    key={id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected ? 'ring-2 ring-amber-500 bg-amber-50' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedSpread(id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={oracleInfo.color}>
                            {oracleInfo.icon}
                            <span className="ml-1">{oracleInfo.name}</span>
                          </Badge>
                          
                          <div>
                            <div className="font-medium text-slate-800">
                              {spread.cartas} carta{spread.cartas > 1 ? 's' : ''}
                            </div>
                            {spread.posiciones && (
                              <div className="text-sm text-slate-600">
                                {spread.posiciones.join(' • ')}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-slate-800">€19.99</div>
                          <div className="text-xs text-slate-500">Incluye PDF</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Preset Questions */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Preguntas Sugeridas</h2>
            
            <div className="grid gap-2">
              {presets.map((preset, index) => {
                const spread = spreads[preset.tirada_id];
                const oracleInfo = spread ? getOracleInfo(spread.oraculo) : null;
                
                return (
                  <Card 
                    key={index}
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => handleSelectPreset(preset)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-4 h-4 text-slate-400" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-800">{preset.label}</div>
                          {oracleInfo && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {oracleInfo.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Checkout Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Solicitar Lectura</CardTitle>
              <CardDescription>
                Completa los datos para recibir tu consulta personalizada
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
                
                <div>
                  <Label htmlFor="question">Tu pregunta (opcional)</Label>
                  <Textarea
                    id="question"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="Escribe tu pregunta o intención para la consulta..."
                    rows={3}
                  />
                </div>
                
                <Separator />
                
                {selectedSpread && spreads[selectedSpread] && (
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">Resumen de tu consulta:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tipo:</span>
                        <span>{getOracleInfo(spreads[selectedSpread].oraculo).name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cartas:</span>
                        <span>{spreads[selectedSpread].cartas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Incluye:</span>
                        <span>PDF descargable</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>€19.99</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={!selectedSpread || !email || loading}
                >
                  {loading ? 'Procesando...' : 'Proceder al Pago'}
                </Button>
                
                <p className="text-xs text-slate-500 text-center">
                  Al continuar aceptas nuestros términos de servicio. 
                  El pago es seguro y está protegido por PayPal.
                </p>
              </form>
            </CardContent>
          </Card>
          
          {/* Info Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-800 mb-2">✨ ¿Qué incluye tu lectura?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Interpretación completa y personalizada</li>
                <li>• PDF descargable con tu consulta</li>
                <li>• Envío opcional por Telegram</li>
                <li>• Acceso permanente en línea</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}