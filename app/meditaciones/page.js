'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, ArrowLeft, Play } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MeditacionesPage() {
  const [meditaciones, setMeditaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/meditaciones')
      .then(res => res.json())
      .then(data => {
        setMeditaciones(data || []);
      })
      .catch(err => {
        console.error('Error loading meditaciones:', err);
        toast.error('Error cargando las meditaciones');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <Clock className="w-8 h-8 mx-auto mb-4 text-slate-400 animate-spin" />
          <p className="text-slate-600">Cargando meditaciones...</p>
        </div>
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
        
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Meditaciones</h1>
          <p className="text-slate-600">Prácticas guiadas para tu bienestar interior</p>
        </div>
      </div>

      {/* Intro Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-emerald-200">
        <CardContent className="p-6 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Encuentra tu centro interior
          </h2>
          <p className="text-slate-600">
            Estas meditaciones complementan perfectamente tus consultas oráculares, 
            ayudándote a integrar la sabiduría recibida y mantener una conexión profunda contigo mismo.
          </p>
        </CardContent>
      </Card>

      {/* Meditaciones List */}
      <div className="grid md:grid-cols-2 gap-6">
        {meditaciones.map((meditacion, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-slate-800">
                  {meditacion.titulo}
                </CardTitle>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {meditacion.duracion}
                </Badge>
              </div>
              <CardDescription>
                {meditacion.descripcion}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {meditacion.image && (
                <div className="mb-4">
                  <img 
                    src={meditacion.image} 
                    alt={meditacion.titulo}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              
              {meditacion.texto && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {meditacion.texto.substring(0, 150)}...
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href={`/meditaciones/${meditacion.slug}`}>
                    <Play className="w-4 h-4 mr-2" />
                    Comenzar
                  </Link>
                </Button>
                
                {meditacion.audio_url && (
                  <Badge variant="secondary" className="px-3 py-2">
                    🎧 Audio
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {meditaciones.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Próximamente
            </h3>
            <p className="text-slate-600">
              Estamos preparando una colección especial de meditaciones para ti.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            ¿Buscas guía espiritual?
          </h3>
          <p className="text-slate-600 mb-4">
            Complementa tu práctica de meditación con una consulta orácular personalizada
          </p>
          <Button asChild>
            <Link href="/tiradas">
              Solicitar Lectura
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}