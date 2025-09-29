import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, Database } from 'lucide-react';
import Link from 'next/link';

export default function PrivacidadPage() {
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
          <div className="mx-auto p-3 bg-blue-600 rounded-full text-white mb-4 w-fit">
            <Shield className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl">Política de Privacidad</CardTitle>
          <CardDescription>
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Database className="w-5 h-5" />
              1. Información que Recopilamos
            </h3>
            <p className="text-slate-600">
              Para proporcionar nuestros servicios de consulta orácular, recopilamos la siguiente información:
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-800">Información Personal:</h4>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Dirección de correo electrónico</li>
                  <li>Preguntas o consultas personalizadas (opcional)</li>
                  <li>ID de chat de Telegram (si opta por recibir notificaciones)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-800">Información Técnica:</h4>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Dirección IP y datos de navegación</li>
                  <li>Información del dispositivo y navegador</li>
                  <li>Cookies de sesión y preferencias</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              2. Cómo Utilizamos su Información
            </h3>
            <p className="text-slate-600">Utilizamos su información personal únicamente para:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>Procesar y entregar sus lecturas oráculares</li>
              <li>Enviar confirmaciones de pago y recibos</li>
              <li>Proporcionar soporte técnico cuando sea necesario</li>
              <li>Enviar notificaciones por Telegram (si está habilitado)</li>
              <li>Mejorar nuestros servicios y experiencia de usuario</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              3. Protección de Datos
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800">
                <strong>Compromiso de Seguridad:</strong> Implementamos medidas de seguridad técnicas y 
                organizacionales apropiadas para proteger su información personal contra acceso no autorizado, 
                alteración, divulgación o destrucción.
              </p>
            </div>
            
            <h4 className="font-medium text-slate-800 mt-4">Medidas de Seguridad:</h4>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>Encriptación de datos en tránsito y en reposo</li>
              <li>Acceso restringido a información personal</li>
              <li>Monitoreo regular de sistemas de seguridad</li>
              <li>Copias de seguridad regulares y seguras</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800">4. Compartir Información</h3>
            <p className="text-slate-600">
              <strong>No vendemos, alquilamos o compartimos</strong> su información personal con terceros, 
              excepto en las siguientes circunstancias limitadas:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>Procesadores de pago (PayPal) para completar transacciones</li>
              <li>Proveedores de servicios técnicos bajo acuerdos de confidencialidad</li>
              <li>Cuando sea requerido por ley o autoridades competentes</li>
              <li>Para proteger nuestros derechos legales o la seguridad de usuarios</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800">5. Sus Derechos (GDPR)</h3>
            <p className="text-slate-600">
              Conforme al Reglamento General de Protección de Datos (GDPR), usted tiene los siguientes derechos:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-800 mb-2">Derechos de Acceso:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Solicitar acceso a sus datos</li>
                  <li>• Obtener copia de su información</li>
                  <li>• Conocer cómo procesamos sus datos</li>
                </ul>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-800 mb-2">Derechos de Control:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Rectificar datos incorrectos</li>
                  <li>• Solicitar eliminación de datos</li>
                  <li>• Limitar el procesamiento</li>
                  <li>• Oponerse al procesamiento</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800">6. Cookies y Tecnologías Similares</h3>
            <p className="text-slate-600">
              Utilizamos cookies y tecnologías similares para:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>Mejorar la funcionalidad del sitio web</li>
              <li>Recordar sus preferencias</li>
              <li>Analizar el uso del sitio web</li>
              <li>Proporcionar contenido personalizado</li>
            </ul>
            <p className="text-slate-600 mt-2">
              Puede controlar las cookies a través de la configuración de su navegador.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800">7. Retención de Datos</h3>
            <p className="text-slate-600">
              Conservamos su información personal durante el tiempo necesario para:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>Proporcionar nuestros servicios</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Resolver disputas</li>
              <li>Hacer cumplir nuestros acuerdos</li>
            </ul>
            <p className="text-slate-600 mt-2">
              Generalmente, eliminamos los datos personales después de 2 años de inactividad, 
              salvo que la ley requiera un período de retención más largo.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800">8. Transferencias Internacionales</h3>
            <p className="text-slate-600">
              Sus datos pueden ser procesados en servidores ubicados fuera de su país de residencia. 
              Garantizamos que todas las transferencias se realizan con las salvaguardas adecuadas 
              para proteger su información personal.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800">9. Menores de Edad</h3>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-amber-800">
                <strong>Restricción de Edad:</strong> Nuestros servicios están dirigidos a personas mayores de 18 años. 
                No recopilamos intencionalmente información personal de menores de edad.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800">10. Cambios en la Política</h3>
            <p className="text-slate-600">
              Podemos actualizar esta política periódicamente. Los cambios significativos serán 
              comunicados por email o mediante aviso en nuestro sitio web.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800">11. Contacto y Ejercicio de Derechos</h3>
            <p className="text-slate-600">
              Para ejercer sus derechos de privacidad o realizar consultas sobre esta política, 
              puede contactarnos a través de los canales disponibles en nuestro sitio web.
            </p>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
              <h4 className="font-medium text-green-800 mb-2">Tiempo de Respuesta:</h4>
              <p className="text-green-700 text-sm">
                Nos comprometemos a responder a sus solicitudes relacionadas con privacidad 
                dentro de los 30 días establecidos por el GDPR.
              </p>
            </div>
          </section>

          <div className="bg-slate-100 p-4 rounded-lg mt-8">
            <p className="text-slate-800 font-medium text-center">
              Su privacidad es fundamental para nosotros. Al utilizar nuestros servicios, 
              usted consiente al procesamiento de sus datos conforme a esta política.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}