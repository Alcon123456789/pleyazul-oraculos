'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, Stars, Compass, Heart, Zap, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setSystemStatus(data))
      .catch(err => console.error('Error fetching status:', err));
  }, []);

  const oracles = [
    {
      id: 'tarot',
      name: 'Tarot',
      icon: <Eye className="w-12 h-12" />,
      description: 'Desvela los misterios de tu pasado, presente y futuro a través de las cartas sagradas',
      color: 'from-purple-600 to-indigo-600',
      features: ['78 Arcanos', 'Múltiples tiradas', 'Interpretación completa']
    },
    {
      id: 'iching',
      name: 'I Ching',
      icon: <Stars className="w-12 h-12" />,
      description: 'El Libro de las Mutaciones revela la sabiduría milenaria china para tu consulta',
      color: 'from-emerald-600 to-teal-600',
      features: ['64 Hexagramas', 'Sabiduría ancestral', 'Guía profunda']
    },
    {
      id: 'rueda',
      name: 'Rueda Medicinal',
      icon: <Compass className="w-12 h-12" />,
      description: 'Conecta con la medicina ancestral de los pueblos originarios y sus animales de poder',
      color: 'from-amber-600 to-orange-600',
      features: ['44 Animales de poder', 'Medicina sagrada', 'Conexión espiritual']
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full text-white">
            <Eye className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-800 to-orange-800 bg-clip-text text-transparent">
            Pleyazul Oráculos
          </h1>
        </div>
        
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Descubre la sabiduría ancestral a través de tres poderosos oráculos. 
          Obtén claridad y guía espiritual para tu camino de vida.
        </p>
        
        {/* System Status */}
        {systemStatus && (
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {systemStatus.integrations.testMode ? '🧪 Modo Test' : '✅ Producción'}
            </Badge>
            <Badge variant={systemStatus.integrations.paypal ? 'default' : 'secondary'} className="text-xs">
              PayPal: {systemStatus.integrations.paypal ? '✅' : '⚠️'}
            </Badge>
            <Badge variant={systemStatus.integrations.telegram ? 'default' : 'secondary'} className="text-xs">
              Telegram: {systemStatus.integrations.telegram ? '✅' : '⚠️'}
            </Badge>
          </div>
        )}
      </div>

      {/* Oracle Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {oracles.map((oracle) => (
          <Card key={oracle.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-orange-200">
            <CardHeader className="text-center pb-4">
              <div className={`mx-auto p-4 rounded-full bg-gradient-to-r ${oracle.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {oracle.icon}
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">{oracle.name}</CardTitle>
              <CardDescription className="text-slate-600">
                {oracle.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {oracle.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button asChild className="w-full" size="lg">
                <Link href="/tiradas">
                  Consultar {oracle.name}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-8" />

      {/* Meditaciones Section */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-emerald-200">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full text-white mb-4 w-fit">
            <Heart className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Meditaciones</CardTitle>
          <CardDescription className="text-slate-600">
            Complementa tu consulta con prácticas de meditación y conexión interior
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild variant="outline" size="lg" className="border-emerald-300 hover:bg-emerald-50">
            <Link href="/meditaciones">
              <BookOpen className="w-5 h-5 mr-2" />
              Explorar Meditaciones
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center space-y-4 py-8">
        <h2 className="text-2xl font-bold text-slate-800">¿Listo para tu consulta?</h2>
        <p className="text-slate-600">
          Elige una tirada y conecta con la sabiduría ancestral que tu alma necesita
        </p>
        
        <div className="flex justify-center gap-4 flex-wrap">
          <Button asChild size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
            <Link href="/tiradas">
              <Stars className="w-5 h-5 mr-2" />
              Pedir Lectura
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/admin">
              <Eye className="w-5 h-5 mr-2" />
              Panel Administrador
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center text-xs text-slate-500 pt-8 border-t border-slate-200">
        <p>
          <strong>Disclaimer:</strong> Este servicio es de carácter espiritual y recreativo. 
          No sustituye el asesoramiento médico, legal o profesional.
        </p>
        <p className="mt-2">
          Honramos las tradiciones Dakota, Lakota y Nakota en el uso respetuoso de la Rueda Medicinal.
        </p>
      </div>
    </div>
  );
}