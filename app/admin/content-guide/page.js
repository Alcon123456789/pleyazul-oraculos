'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, BookOpen, Image, Music, FileText, 
  Code, FolderOpen, Upload, Eye, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ContentGuidePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al admin
          </Link>
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Guía de Contenido</h1>
          <p className="text-slate-600">Aprende a gestionar el contenido de Pleyazul Oráculos</p>
        </div>
      </div>

      {/* Introduction */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">Introducción</h2>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Pleyazul Oráculos utiliza un sistema de contenido basado en archivos JSON que te permite 
            personalizar completamente las interpretaciones, añadir imágenes y audio, y gestionar 
            todas las configuraciones de los oráculos desde una interfaz sencilla.
          </p>
        </CardContent>
      </Card>

      {/* Content Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Estructura de Contenido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm">
            <div className="text-slate-600">/content/</div>
            <div className="ml-4 space-y-1">
              <div>├── tarot.json <Badge variant="outline" className="ml-2 text-xs">78 cartas</Badge></div>
              <div>├── iching.json <Badge variant="outline" className="ml-2 text-xs">64 hexagramas</Badge></div>
              <div>├── rueda.json <Badge variant="outline" className="ml-2 text-xs">Animales de poder</Badge></div>
              <div>├── spreads.json <Badge variant="outline" className="ml-2 text-xs">Tipos de tiradas</Badge></div>
              <div>├── presets.json <Badge variant="outline" className="ml-2 text-xs">Preguntas sugeridas</Badge></div>
              <div>└── meditaciones.json <Badge variant="outline" className="ml-2 text-xs">Prácticas guiadas</Badge></div>
            </div>
            <div className="text-slate-600 mt-4">/public/</div>
            <div className="ml-4 space-y-1">
              <div>├── img/tarot/ <Badge variant="secondary" className="ml-2 text-xs">Imágenes de cartas</Badge></div>
              <div>├── img/rueda/ <Badge variant="secondary" className="ml-2 text-xs">Imágenes de animales</Badge></div>
              <div>└── audio/ <Badge variant="secondary" className="ml-2 text-xs">Archivos de audio</Badge></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarot Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-600" />
            Configuración del Tarot
          </CardTitle>
          <CardDescription>
            Cómo editar las cartas del tarot y añadir imágenes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Estructura de una carta:</h4>
            <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`{
  "name": "El Loco",
  "upright": "Nuevos comienzos, espontaneidad...",
  "reversed": "Imprudencia, impulsividad...",
  "love": {
    "upright": "Nueva relación llena de aventuras...",
    "reversed": "Relación inestable..."
  },
  "work": {
    "upright": "Nuevo proyecto creativo...",
    "reversed": "Falta de planificación laboral..."
  },
  "health": {
    "upright": "Energía renovada...",
    "reversed": "Descuido de la salud..."
  },
  "advice": "Confía en tu intuición...",
  "image": "/img/tarot/el-loco.jpg"
}`}</pre>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Image className="w-4 h-4 text-amber-600" />
              <h4 className="font-medium text-amber-800">Añadir Imágenes</h4>
            </div>
            <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
              <li>Sube tu imagen a <code>/public/img/tarot/</code></li>
              <li>Nombra el archivo (ej: <code>el-loco.jpg</code>)</li>
              <li>Añade el campo <code>"image": "/img/tarot/el-loco.jpg"</code> en el JSON</li>
              <li>La imagen se mostrará en las lecturas y PDFs</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* I Ching Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stars className="w-5 h-5 text-emerald-600" />
            Configuración del I Ching
          </CardTitle>
          <CardDescription>
            Estructura de los hexagramas y su sabiduría
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Estructura de un hexagrama:</h4>
            <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`{
  "hex": 1,
  "nombre": "El Creador",
  "palabras_clave": ["creatividad", "liderazgo", "fuerza"],
  "juicio": "El Creador obra sublime éxito...",
  "imagen": "El movimiento del cielo es vigoroso...",
  "consejo": "Es momento de actuar con determinación...",
  "lineas": {
    "1": "Dragón oculto. No actuar.",
    "2": "Dragón que aparece en el campo...",
    "3": "El hombre noble trabaja con ahínco...",
    "4": "Salto vacilante sobre el abismo...",
    "5": "Dragón volante en el cielo...",
    "6": "Dragón altivo tendrá motivo..."
  }
}`}</pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rueda Medicinal Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600" />
            Configuración de la Rueda Medicinal
          </CardTitle>
          <CardDescription>
            Animales de poder y medicina ancestral
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Estructura de un animal:</h4>
            <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`{
  "animal": "Búfalo",
  "arquetipo": "El Proveedor",
  "luz": "Abundancia, gratitud, generosidad...",
  "sombra": "Avaricia, desperdicio...",
  "medicina": "Enseña el sagrado equilibrio...",
  "afirmacion": "Agradezco la abundancia...",
  "elemento": "Tierra",
  "direccion": "Norte",
  "image": "/img/rueda/bufalo.jpg"
}`}</pre>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-green-600" />
              <h4 className="font-medium text-green-800">Respeto Cultural</h4>
            </div>
            <p className="text-sm text-green-700">
              La Rueda Medicinal es una tradición sagrada de los pueblos Dakota, Lakota y Nakota. 
              Úsala con respeto y reconocimiento de su origen cultural.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Meditations Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5 text-indigo-600" />
            Configuración de Meditaciones
          </CardTitle>
          <CardDescription>
            Añadir meditaciones con texto, imágenes y audio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Estructura de una meditación:</h4>
            <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`{
  "slug": "respiracion-consciente",
  "titulo": "Respiración Consciente",
  "descripcion": "Una meditación guiada para...",
  "duracion": "10 minutos",
  "texto": "Siéntate cómodamente y cierra los ojos...",
  "image": "/img/meditation-breathe.svg",
  "audio_url": "/audio/respiracion-consciente.mp3"
}`}</pre>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Image className="w-4 h-4 text-blue-600" />
                <h4 className="font-medium text-blue-800">Imágenes</h4>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Sube a <code>/public/img/</code></li>
                <li>• Formatos: JPG, PNG, SVG</li>
                <li>• Tamaño recomendado: 300x200px</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Music className="w-4 h-4 text-purple-600" />
                <h4 className="font-medium text-purple-800">Audio</h4>
              </div>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Sube a <code>/public/audio/</code></li>
                <li>• Formato: MP3</li>
                <li>• Calidad: 128kbps mínimo</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-slate-600" />
            Mejores Prácticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 mb-3">✅ Recomendaciones</h4>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Haz copias de seguridad antes de editar</li>
                <li>• Usa nombres de archivo descriptivos</li>
                <li>• Optimiza las imágenes para web</li>
                <li>• Mantén consistencia en el estilo</li>
                <li>• Revisa la sintaxis JSON</li>
                <li>• Prueba los cambios antes de publicar</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-700 mb-3">❌ Evitar</h4>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• No edites archivos sin respaldo</li>
                <li>• No uses caracteres especiales en nombres</li>
                <li>• No subas archivos muy pesados</li>
                <li>• No copies contenido con derechos de autor</li>
                <li>• No elimines campos requeridos</li>
                <li>• No mezcles idiomas sin consistencia</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-slate-50 to-gray-50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Acciones Rápidas</h3>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/admin">
                <Upload className="w-4 h-4 mr-2" />
                Editor de Contenido
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/tiradas">
                <Eye className="w-4 h-4 mr-2" />
                Ver Tiradas
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/meditaciones">
                <Music className="w-4 h-4 mr-2" />
                Ver Meditaciones
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}