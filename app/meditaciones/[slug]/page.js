'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, Clock, ArrowLeft, Play, Pause, RotateCcw, 
  Volume2, VolumeX, Timer 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MeditacionDetailPage({ params }) {
  const [meditacion, setMeditacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showFullText, setShowFullText] = useState(false);
  const slug = params.slug;

  useEffect(() => {
    fetch('/api/content/meditaciones')
      .then(res => res.json())
      .then(data => {
        const meditaciones = data || [];
        const found = meditaciones.find(m => m.slug === slug);
        if (found) {
          setMeditacion(found);
        } else {
          toast.error('Meditación no encontrada');
        }
      })
      .catch(err => {
        console.error('Error loading meditacion:', err);
        toast.error('Error cargando la meditación');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <Clock className="w-8 h-8 mx-auto mb-4 text-slate-400 animate-spin" />
          <p className="text-slate-600">Cargando meditación...</p>
        </div>
      </div>
    );
  }

  if (!meditacion) {
    return (
      <div className="text-center py-16">
        <Heart className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Meditación no encontrada</h2>
        <p className="text-slate-600 mb-6">La meditación solicitada no existe.</p>
        <Button asChild>
          <Link href="/meditaciones">Volver a Meditaciones</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/meditaciones">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a meditaciones
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-emerald-200">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full text-white mb-4 w-fit">
            <Heart className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl text-slate-800">
            {meditacion.titulo}
          </CardTitle>
          <CardDescription className="text-lg">
            {meditacion.descripcion}
          </CardDescription>
          
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {meditacion.duracion}
            </Badge>
            
            {meditacion.audio_url && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                Audio disponible
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Audio Player (if available) */}
      {meditacion.audio_url && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reproductor de Audio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-100 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">🎧</div>
                <p className="text-slate-600 mb-4">
                  Función de audio próximamente disponible
                </p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" disabled>
                    <Play className="w-4 h-4 mr-2" />
                    Reproducir
                  </Button>
                  <Button variant="outline" disabled>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reiniciar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text Content */}
      {meditacion.texto && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Guía de Meditación</CardTitle>
            <CardDescription>
              Sigue estas instrucciones para una experiencia completa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Preparación:</span>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Busca un lugar cómodo y silencioso</li>
                  <li>• Adopta una postura relajada pero alerta</li>
                  <li>• Desconecta las distracciones externas</li>
                  <li>• Respira profundamente tres veces</li>
                </ul>
              </div>
              
              <Separator />
              
              <div className="prose max-w-none">
                <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {showFullText ? meditacion.texto : `${meditacion.texto.substring(0, 300)}...`}
                </div>
                
                {meditacion.texto.length > 300 && (
                  <Button 
                    variant="link" 
                    className="px-0 mt-2"
                    onClick={() => setShowFullText(!showFullText)}
                  >
                    {showFullText ? 'Mostrar menos' : 'Leer completo'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Practice Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Consejos para tu Práctica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-800">✨ Durante la práctica:</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• No juzgues tus pensamientos</li>
                <li>• Vuelve suavemente a la respiración</li>
                <li>• Permite que las sensaciones fluyan</li>
                <li>• Mantén una actitud de curiosidad</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-slate-800">🌱 Después de meditar:</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Toma unos momentos de silencio</li>
                <li>• Reflexiona sobre tu experiencia</li>
                <li>• Agradece este tiempo contigo</li>
                <li>• Lleva la calma a tu día</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            ¿Buscas más claridad en tu camino?
          </h3>
          <p className="text-slate-600 mb-4">
            Complementa tu práctica de meditación con una consulta orácular personalizada
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link href="/tiradas">
                Solicitar Lectura
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/meditaciones">
                Más Meditaciones
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}