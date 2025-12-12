# Despliegue en Render - Pleyazul Oráculos

## Configuración de Render

### Build Command
```bash
npm install --include=dev && npm run build
```

### Start Command
```bash
npm start
```

El script de `npm start` está configurado para usar automáticamente la variable `$PORT` de Render.

## Variables de Entorno Requeridas en Render

### Variables Básicas (Requeridas)
```
NODE_ENV=production
NPM_CONFIG_PRODUCTION=false
```

### Variables de Base de Datos
```
MONGODB_URI=<tu-mongodb-uri>
```
**Nota:** Si estás usando MongoDB Atlas u otro servicio de MongoDB, usa la URI completa. Para MongoDB local en Render, usa `mongodb://localhost:27017/pleyazul_oraculos`

### Variables de Aplicación
```
NEXT_PUBLIC_BASE_URL=https://pleyazul-oraculos.onrender.com
APP_BASE_URL=https://pleyazul-oraculos.onrender.com
```

### Variables Opcionales (Para modo producción con pagos reales)
```
# PayPal
PAYPAL_CLIENT_ID=<tu-client-id>
PAYPAL_CLIENT_SECRET=<tu-client-secret>
PAYPAL_MODE=sandbox  # o 'live' para producción

# Telegram (opcional)
TELEGRAM_BOT_TOKEN=<tu-bot-token>

# OpenAI (para generación de contenido)
OPENAI_API_KEY=<tu-api-key>
```

### Variables de Modo TEST (Configuración actual)
```
TEST_MODE=true
DISABLE_PDF=true
CORS_ORIGINS=*
```

## Health Check Endpoint

La aplicación incluye un endpoint de health check en:
```
GET /api/status
```

Respuesta:
```json
{
  "status": "ok",
  "timestamp": "2024-12-12T22:00:00.000Z",
  "service": "pleyazul-oraculos",
  "version": "1.0.0"
}
```

Puedes configurar este endpoint en Render como Health Check Path: `/api/status`

## Correcciones Realizadas

### 1. Problema de useSearchParams
✅ **Resuelto**: Se agregó `export const dynamic = 'force-dynamic'` en:
- `/app/checkout/page.js`
- `/app/checkout/test/page.js`

Esto previene el pre-rendering de estas páginas que dependen de parámetros de URL dinámicos.

### 2. Puerto de Render
✅ **Resuelto**: El script `start` ahora usa `-p ${PORT:-3000}` para respetar la variable `$PORT` de Render.

### 3. Warning de supports-color
✅ **Mitigado**: Se configuró webpack en `next.config.js` para externalizar `node-telegram-bot-api` y sus dependencias.

## Testing Local

Para probar localmente antes de desplegar:

```bash
# Instalar dependencias
npm install

# Build de producción
npm run build

# Ejecutar en modo producción
PORT=3000 npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Verificación Post-Despliegue

1. Verificar que el build se complete sin errores
2. Verificar que el servicio inicie correctamente
3. Probar el endpoint de health check: `https://pleyazul-oraculos.onrender.com/api/status`
4. Probar la página principal: `https://pleyazul-oraculos.onrender.com`
5. Probar las tiradas demo: `https://pleyazul-oraculos.onrender.com/tiradas`
6. Probar el checkout en modo test: `https://pleyazul-oraculos.onrender.com/checkout/test`

## Modo TEST vs Producción

### Modo TEST (Actual)
- `TEST_MODE=true`: Las órdenes se procesan sin PayPal
- `DISABLE_PDF=true`: Los PDFs se simulan sin generación real
- Puedes probar todo el flujo sin configurar PayPal

### Modo Producción
Para activar pagos reales:
1. Remover o cambiar `TEST_MODE=false`
2. Remover o cambiar `DISABLE_PDF=false`
3. Configurar correctamente `PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET`
4. Cambiar `PAYPAL_MODE` a `sandbox` o `live`

## Soporte

Si encuentras problemas durante el despliegue:
1. Verifica los logs de build en Render
2. Verifica los logs de runtime en Render
3. Asegúrate de que todas las variables de entorno estén configuradas
4. Verifica que la base de datos MongoDB esté accesible desde Render
