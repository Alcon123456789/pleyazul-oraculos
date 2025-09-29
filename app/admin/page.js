'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, Settings, CheckCircle, XCircle, AlertTriangle, 
  Eye, Copy, ExternalLink, Database, MessageCircle,
  CreditCard, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminPage() {
  const [setupStatus, setSetupStatus] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSetupStatus();
  }, []);

  const fetchSetupStatus = async () => {
    try {
      const response = await fetch('/api/admin/setup-status');
      const data = await response.json();
      setSetupStatus(data);
    } catch (error) {
      console.error('Error fetching setup status:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple auth for demo
      setAuthenticated(true);
      toast.success('Acceso concedido');
    } else {
      toast.error('Contraseña incorrecta');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado al portapapeles');
  };

  if (!setupStatus) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <Settings className="w-8 h-8 mx-auto mb-4 text-slate-400 animate-spin" />
          <p className="text-slate-600">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-slate-800 rounded-full text-white mb-4 w-fit">
              <Shield className="w-8 h-8" />
            </div>
            <CardTitle>Panel de Administración</CardTitle>
            <CardDescription>
              Acceso protegido - Ingresa la contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verificando...' : 'Acceder'}
              </Button>
            </form>
            
            <div className="mt-4 pt-4 border-t text-center">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al inicio
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Panel de Administración</h1>
          <p className="text-slate-600">Configuración y monitoreo del sistema</p>
        </div>
        
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Estado del Sistema</TabsTrigger>
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        {/* Setup Status Tab */}
        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Integraciones</CardTitle>
              <CardDescription>
                Verifica que todas las integraciones estén configuradas correctamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* PayPal Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">PayPal</h4>
                    <p className="text-sm text-slate-600">Procesamiento de pagos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {setupStatus.paypal_configured ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Configurado
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">
                      <XCircle className="w-3 h-3 mr-1" />
                      No configurado
                    </Badge>
                  )}
                </div>
              </div>

              {/* Telegram Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">Telegram Bot</h4>
                    <p className="text-sm text-slate-600">Envío de notificaciones</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {setupStatus.telegram_configured ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Configurado
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">
                      <XCircle className="w-3 h-3 mr-1" />
                      No configurado
                    </Badge>
                  )}
                </div>
              </div>

              {/* Test Mode Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-amber-600" />
                  <div>
                    <h4 className="font-medium">Modo de Prueba</h4>
                    <p className="text-sm text-slate-600">Simulación de pagos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {setupStatus.test_mode ? (
                    <Badge className="bg-amber-100 text-amber-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Activo
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Producción
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Webhook URLs */}
          <Card>
            <CardHeader>
              <CardTitle>URLs de Webhooks</CardTitle>
              <CardDescription>
                Configura estos endpoints en tus servicios externos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>PayPal Webhook URL</Label>
                <div className="flex gap-2">
                  <Input 
                    value={setupStatus.webhooks.paypal_url} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(setupStatus.webhooks.paypal_url)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Telegram Webhook URL</Label>
                <div className="flex gap-2">
                  <Input 
                    value={setupStatus.webhooks.telegram_url} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(setupStatus.webhooks.telegram_url)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instrucciones de Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">💳 PayPal Setup:</h4>
                  <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
                    <li>Crear cuenta en <a href="https://developer.paypal.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">PayPal Developer</a></li>
                    <li>Crear una nueva aplicación</li>
                    <li>Copiar Client ID y Client Secret al archivo .env</li>
                    <li>Configurar el webhook con la URL proporcionada arriba</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">🤖 Telegram Bot Setup:</h4>
                  <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
                    <li>Hablar con @BotFather en Telegram</li>
                    <li>Enviar /newbot y seguir las instrucciones</li>
                    <li>Copiar el token al archivo .env</li>
                    <li>Configurar el webhook (se hace automáticamente)</li>
                  </ol>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Nota:</strong> El sistema funcionará en modo de prueba mientras las integraciones no estén configuradas.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Management Tab */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Contenido</CardTitle>
              <CardDescription>
                Edita los contenidos de los oráculos y configuraciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Database className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Editor de Contenido
                </h3>
                <p className="text-slate-600 mb-4">
                  La funcionalidad de edición de contenido estará disponible próximamente.
                  Por ahora, puedes editar los archivos JSON en la carpeta /content.
                </p>
                <Button variant="outline" disabled>
                  Próximamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Pedidos</CardTitle>
              <CardDescription>
                Monitorea y administra las órdenes y lecturas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Eye className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Panel de Pedidos
                </h3>
                <p className="text-slate-600 mb-4">
                  El panel de gestión de pedidos estará disponible próximamente.
                </p>
                <Button variant="outline" disabled>
                  Próximamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Sistema</CardTitle>
              <CardDescription>
                Variables de entorno y configuraciones avanzadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">Variables de PayPal:</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>PAYPAL_ENV: {setupStatus.test_mode ? 'sandbox' : 'live'}</li>
                    <li>PAYPAL_CLIENT_ID: {setupStatus.paypal_configured ? '✓ Configurado' : '✗ No configurado'}</li>
                    <li>PAYPAL_CLIENT_SECRET: {setupStatus.paypal_configured ? '✓ Configurado' : '✗ No configurado'}</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">Variables de Telegram:</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>TELEGRAM_BOT_TOKEN: {setupStatus.telegram_configured ? '✓ Configurado' : '✗ No configurado'}</li>
                    <li>TELEGRAM_WEBHOOK_SECRET: ✓ Configurado</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Las variables de entorno deben configurarse en el archivo .env del servidor.
                  Reinicia el servicio después de hacer cambios.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}