import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scale } from 'lucide-react';
import Link from 'next/link';

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto p-3 bg-slate-800 rounded-full text-white mb-4 w-fit">
            <Scale className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl">Términos y Condiciones de Servicio</CardTitle>
          <CardDescription>
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-slate-800">1. Naturaleza del Servicio</h3>
            <p className="text-slate-600">
              Pleyazul Oráculos ofrece servicios de consulta espiritual y recreativa a través de diferentes sistemas 
              oráculares: Tarot, I Ching y Rueda Medicinal. Nuestro servicio tiene carácter informativo y de entretenimiento, 
              no constituyendo asesoramiento profesional de ningún tipo.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800">2. Limitaciones y Descargo de Responsabilidad</h3>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-amber-800 font-medium">
                <strong>IMPORTANTE:</strong> Las lecturas oráculares proporcionadas NO sustituyen el asesoramiento 
                médico, legal, financiero o profesional de ningún tipo. Siempre consulte con profesionales 
                cualificados para decisiones importantes en su vida.
              </p>
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1 mt-3">
              <li>Los oráculos ofrecen perspectivas simbólicas e introspectivas</li>
              <li>Las interpretaciones son de naturaleza general y subjetiva</li>
              <li>No garantizamos resultados específicos o predicciones exactas</li>
              <li>El usuario es responsable de sus decisiones y acciones</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800">3. Uso del Servicio</h3>
            <p className="text-slate-600">
              Al utilizar nuestros servicios, usted acepta:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>Ser mayor de 18 años o contar con supervisión parental</li>
              <li>Proporcionar información veraz y actualizada</li>
              <li>Utilizar el servicio de manera responsable y ética</li>
              <li>No usar las lecturas para dañar a terceros</li>
              <li>Respetar la propiedad intelectual del contenido</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800">4. Pagos y Reembolsos</h3>
            <p className="text-slate-600">
              Los pagos se procesan de forma segura a través de PayPal. Una vez completado el pago y 
              entregada la lectura, no se realizan reembolsos excepto en casos de falla técnica 
              comprobada del servicio.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800">5. Propiedad Intelectual</h3>
            <p className="text-slate-600">
              Todo el contenido, interpretaciones y metodologías utilizadas son propiedad de Pleyazul Oráculos. 
              Está prohibida la reproducción, distribución o uso comercial sin autorización expresa.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800">6. Respeto Cultural</h3>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-800">
                <strong>Reconocimiento Cultural:</strong> Honramos y respetamos las tradiciones sagradas de los 
                pueblos Dakota, Lakota y Nakota en nuestro uso respetuoso de la Rueda Medicinal. 
                Reconocemos que estas son tradiciones vivas y sagradas que merecen nuestro máximo respeto.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800">7. Privacidad y Datos</h3>
            <p className="text-slate-600">
              Su privacidad es importante para nosotros. Consulte nuestra{' '}
              <Link href="/legal/privacidad" className="text-blue-600 hover:underline">
                Política de Privacidad
              </Link>{' '}
              para conocer cómo manejamos sus datos personales.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800">8. Modificaciones</h3>
            <p className="text-slate-600">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios serán efectivos inmediatamente tras su publicación en el sitio web.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800">9. Contacto</h3>
            <p className="text-slate-600">
              Para consultas sobre estos términos o nuestros servicios, puede contactarnos a través 
              de los canales de comunicación disponibles en nuestro sitio web.
            </p>
          </section>

          <div className="bg-slate-100 p-4 rounded-lg mt-8">
            <p className="text-slate-800 font-medium text-center">
              Al utilizar nuestros servicios, usted confirma haber leído, entendido y aceptado 
              estos Términos y Condiciones en su totalidad.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}