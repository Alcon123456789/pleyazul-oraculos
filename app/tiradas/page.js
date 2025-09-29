'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, Eye, Stars, Compass, Sparkles, 
  Play, CreditCard, Zap, Heart, BookOpen 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function TiradasPage() {
  const [spreads, setSpreads] = useState({});
  const [presets, setPresets] = useState([]);
  const [email, setEmail] = useState('');
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
      tarot: { 
        name: 'Tarot', 
        icon: <Eye className="w-5 h-5" />, 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        gradient: 'from-purple-600 to-indigo-600',
        description: 'Las cartas sagradas revelan los misterios de tu pasado, presente y futuro',
        features: ['78 Arcanos Mayores y Menores', 'Cartas invertidas', 'Múltiples tiradas']
      },
      iching: { 
        name: 'I Ching', 
        icon: <Stars className="w-5 h-5" />, 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        gradient: 'from-emerald-600 to-teal-600',
        description: 'El Libro de las Mutaciones ofrece sabiduría milenaria china',
        features: ['64 Hexagramas sagrados', 'Filosofía ancestral', 'Guía profunda']
      },
      rueda: { 
        name: 'Rueda Medicinal', 
        icon: <Compass className="w-5 h-5" />, 
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        gradient: 'from-amber-600 to-orange-600',
        description: 'Conecta con los animales de poder y la medicina ancestral',
        features: ['Animales de poder', 'Medicina sagrada', 'Tradición nativa']
      }
    };
    return info[oraculo] || { name: oraculo, icon: <Sparkles className="w-5 h-5" />, color: 'bg-gray-100 text-gray-800' };
  };

  const getSpreadDescription = (spreadId, spread) => {
    const descriptions = {
      'tarot_3_ppf': 'Explora tu línea temporal con tres cartas que revelan tu pasado, presente y futuro.',
      'tarot_5_claridad': 'Una lectura profunda de cinco cartas para obtener claridad total en tu situación.',
      'iching_1': 'Consulta un hexagrama del I Ching para recibir sabiduría ancestral.',
      'rueda_3': 'Descubre tu fuerza, reto y camino con tres animales de poder.',
      'rueda_astral': 'Consulta completa de los cinco puntos cardinales de la rueda sagrada.'
    };
    return descriptions[spreadId] || 'Consulta personalizada del oráculo seleccionado.';
  };

  const handleDemo = async (spreadId) => {
    if (!email) {
      toast.error('Ingresa tu email para probar el demo');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/demo/reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          spread_id: spreadId
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('¡Demo generado! Redirigiendo...');
        setTimeout(() => {
          router.push(data.redirect_url);
        }, 1000);
      } else {
        toast.error(data.error || 'Error generando demo');
      }
    } catch (error) {
      console.error('Demo error:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = (spreadId) => {
    if (!email) {
      toast.error('Ingresa tu email para continuar');
      return;
    }

    const params = new URLSearchParams({
      spread_id: spreadId,
      email: email
    });
    
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Consultas Oraculares</h1>
          <p className="text-slate-600">Elige tu camino hacia la sabiduría espiritual</p>
        </div>
      </div>

      {/* Oracle Introduction */}
      <div className="grid md:grid-cols-3 gap-6">
        {['tarot', 'iching', 'rueda'].map((oracle) => {
          const info = getOracleInfo(oracle);
          return (
            <Card key={oracle} className={`border-2 ${info.color}`}>
              <CardContent className="p-6 text-center">
                <div className={`mx-auto p-3 bg-gradient-to-r ${info.gradient} rounded-full text-white mb-4 w-fit`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{info.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{info.description}</p>
                <div className="space-y-1">
                  {info.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-slate-600">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Email Input */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="max-w-md mx-auto">
            <Label htmlFor="email" className="text-lg font-semibold text-slate-800">
              Ingresa tu email para comenzar:
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="mt-2"
              size="lg"
            />
            <p className="text-xs text-slate-600 mt-2">
              Recibirás tu lectura en este email. También puedes probar nuestros demos gratuitos.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Spreads Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(spreads).map(([spreadId, spread]) => {
          const oracleInfo = getOracleInfo(spread.oraculo);
          const description = getSpreadDescription(spreadId, spread);
          
          return (
            <Card key={spreadId} className="hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={oracleInfo.color}>
                    {oracleInfo.icon}
                    <span className="ml-1">{oracleInfo.name}</span>
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {spread.cartas} {spread.oraculo === 'iching' ? 'hexagrama' : 
                                   spread.oraculo === 'rueda' ? 'animales' : 'cartas'}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg">
                  {spread.posiciones ? spread.posiciones.join(' • ') : `Consulta ${oracleInfo.name}`}
                </CardTitle>
                <CardDescription>
                  {description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {spread.posiciones && (
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <h5 className="text-sm font-medium text-slate-800 mb-2">Posiciones:</h5>
                    <div className="flex flex-wrap gap-1">
                      {spread.posiciones.map((pos, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {pos}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDemo(spreadId)}
                    disabled={!email || loading}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Demo Gratis
                  </Button>
                  
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleOrder(spreadId)}
                    disabled={!email}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    €19.99
                  </Button>
                </div>
                
                <p className="text-xs text-slate-500 text-center">
                  Demo: lectura de muestra • Pago: lectura completa + PDF
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Preset Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Preguntas Populares
          </CardTitle>
          <CardDescription>
            Consultas frecuentes para inspirarte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {presets.map((preset, index) => {
              const spread = spreads[preset.tirada_id];
              const oracleInfo = spread ? getOracleInfo(spread.oraculo) : null;
              
              return (
                <Card key={index} className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-full">
                        {oracleInfo?.icon || <Sparkles className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800 mb-1">{preset.label}</h4>
                        {oracleInfo && (
                          <Badge variant="outline" className="text-xs">
                            {oracleInfo.name}
                          </Badge>
                        )}
                        <div className="flex gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDemo(preset.tirada_id)}
                            disabled={!email || loading}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Demo
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleOrder(preset.tirada_id)}
                            disabled={!email}
                          >
                            <CreditCard className="w-3 h-3 mr-1" />
                            Pagar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-2">¿Primera vez consultando los oráculos?</h3>
          <p className="text-slate-600 mb-6">
            Explora nuestras meditaciones guiadas para preparar tu mente y corazón
          </p>
          <Button asChild variant="outline" size="lg">
            <Link href="/meditaciones">
              <BookOpen className="w-5 h-5 mr-2" />
              Explorar Meditaciones
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}