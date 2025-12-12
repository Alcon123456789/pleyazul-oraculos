# 🚀 Instrucciones de Despliegue en Render

## ✅ Correcciones Completadas

Todos los problemas de build han sido resueltos:

1. ✅ **useSearchParams wrapped in Suspense** - Corregido en checkout/page.js y checkout/test/page.js
2. ✅ **MongoDB environment variables** - Validación movida a runtime
3. ✅ **supports-color warning** - Configurado en webpack
4. ✅ **Puerto dinámico** - Script de start configurado para usar $PORT
5. ✅ **Health check endpoint** - Creado en /api/status

---

## 📝 Pasos para Desplegar

### Paso 1: Hacer Commit y Push
```bash
git add .
git commit -m "Fix: Correcciones para despliegue en Render"
git push origin main
```

### Paso 2: Configuración en Render

Ve a tu servicio en Render y verifica/actualiza:

#### Build & Deploy
- **Build Command:**
  ```
  npm install --include=dev && npm run build
  ```

- **Start Command:**
  ```
  npm start
  ```

#### Variables de Entorno

**Variables Mínimas (Requeridas):**
```
NODE_ENV=production
NPM_CONFIG_PRODUCTION=false
TEST_MODE=true
DISABLE_PDF=true
CORS_ORIGINS=*
```

**URLs de la Aplicación:**
```
NEXT_PUBLIC_BASE_URL=https://pleyazul-oraculos.onrender.com
APP_BASE_URL=https://pleyazul-oraculos.onrender.com
```

**Base de Datos (Opcional para testing):**
```
MONGODB_URI=mongodb://localhost:27017/pleyazul_oraculos
```
*Nota: Si tienes MongoDB Atlas, usa tu URI completa aquí*

#### Health Check
- **Path:** `/api/status`
- **Interval:** 30 segundos (recomendado)

### Paso 3: Desplegar

Opción A - Auto Deploy:
- Si tienes auto-deploy activado, el push a main disparará automáticamente el deploy

Opción B - Manual Deploy:
1. Ve a tu servicio en Render Dashboard
2. Haz clic en "Manual Deploy"
3. Selecciona "Deploy latest commit"
4. Espera a que el build se complete

---

## 🔍 Verificación Post-Despliegue

Una vez que el deploy termine, verifica estos endpoints:

### 1. Health Check
```bash
curl https://pleyazul-oraculos.onrender.com/api/status
```
**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-12T22:00:00.000Z",
  "service": "pleyazul-oraculos",
  "version": "1.0.0"
}
```

### 2. Página Principal
```
https://pleyazul-oraculos.onrender.com
```

### 3. Página de Tiradas
```
https://pleyazul-oraculos.onrender.com/tiradas
```

### 4. Página de Checkout
```
https://pleyazul-oraculos.onrender.com/checkout
```

### 5. Checkout Test
```
https://pleyazul-oraculos.onrender.com/checkout/test?order_id=test123
```

---

## 🐛 Troubleshooting

### Si el build falla en Render:

1. **Revisa los logs de build:**
   - Ve a tu servicio en Render
   - Haz clic en la pestaña "Logs"
   - Busca mensajes de error en rojo

2. **Verifica las variables de entorno:**
   - Asegúrate de que todas las variables mínimas estén configuradas
   - No debe haber espacios extra en los valores

3. **Problema: "Cannot find module"**
   - Asegúrate de que `NPM_CONFIG_PRODUCTION=false` esté configurado
   - Verifica que el build command incluya `--include=dev`

### Si el servidor no inicia:

1. **Revisa los logs de runtime:**
   - En Render Dashboard, ve a "Logs"
   - Filtra por "Runtime Logs"

2. **Problema: Puerto incorrecto**
   - Render automáticamente pasa `$PORT` como variable de entorno
   - Nuestro script ya está configurado para usarlo
   - Verifica que el start command sea exactamente: `npm start`

3. **Problema: MongoDB connection**
   - Si no tienes MongoDB configurado, asegúrate de que `TEST_MODE=true`
   - La app debería iniciar sin MongoDB en modo test

### Si el health check falla:

1. Verifica que el path sea exactamente: `/api/status`
2. Espera 2-3 minutos después del deploy antes de probar
3. Prueba acceder manualmente al endpoint en tu navegador

---

## 🔧 Modo Test vs Producción

### Configuración Actual (Test Mode)
Con las variables actuales, la aplicación funciona en modo demostración:
- ✅ Todas las páginas cargan correctamente
- ✅ Las tiradas se pueden visualizar
- ✅ El checkout redirige a una simulación de pago
- ❌ No se procesan pagos reales de PayPal
- ❌ No se generan PDFs reales

### Para Activar Modo Producción
Cuando estés listo para pagos reales:

1. Agrega las credenciales de PayPal:
   ```
   PAYPAL_CLIENT_ID=tu_client_id_real
   PAYPAL_CLIENT_SECRET=tu_client_secret_real
   PAYPAL_MODE=sandbox  # o 'live' para producción real
   ```

2. Actualiza las variables de modo:
   ```
   TEST_MODE=false
   DISABLE_PDF=false
   ```

3. Agrega OpenAI para generación de contenido:
   ```
   OPENAI_API_KEY=tu_api_key
   ```

4. (Opcional) Telegram para notificaciones:
   ```
   TELEGRAM_BOT_TOKEN=tu_bot_token
   ```

---

## 📊 Logs y Monitoreo

### Ver logs en tiempo real:
```bash
# Desde Render Dashboard
1. Ve a tu servicio
2. Haz clic en "Logs"
3. Los logs se actualizan automáticamente
```

### Logs importantes a revisar:
- ✅ "Ready in XXXms" - Servidor iniciado correctamente
- ✅ "Compiled successfully" - Build completado
- ❌ "Error:" - Cualquier línea con "Error" requiere atención
- ⚠️ "Warning:" - Warnings generalmente son informativos

---

## 📞 Soporte

Si después de seguir estos pasos aún tienes problemas:

1. **Verifica el script de verificación local:**
   ```bash
   ./verify-build.sh
   ```
   Esto probará el build localmente antes de deploy

2. **Revisa los archivos de documentación:**
   - `CAMBIOS_REALIZADOS.md` - Lista completa de cambios
   - `RENDER_DEPLOYMENT.md` - Guía técnica detallada

3. **Información de debug útil:**
   - Versión de Node en Render: 20.x (automático)
   - Next.js version: 14.2.3
   - Build output: `standalone` mode

---

## ✅ Checklist Final

Antes de hacer deploy, confirma:

- [ ] Commits pusheados a GitHub (branch: main)
- [ ] Build Command configurado en Render
- [ ] Start Command configurado en Render
- [ ] Variables de entorno mínimas configuradas
- [ ] Health Check path configurado: `/api/status`
- [ ] Auto-deploy activado (opcional)

Una vez desplegado:

- [ ] Health check responde correctamente
- [ ] Página principal carga
- [ ] Página de tiradas funciona
- [ ] Checkout carga sin errores
- [ ] No hay errores en los logs de Render

---

## 🎉 ¡Listo!

Una vez que todos los checks estén verdes, tu aplicación estará funcionando en:

🌐 **https://pleyazul-oraculos.onrender.com**

¡Feliz despliegue! 🚀
