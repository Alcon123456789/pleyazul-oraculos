# Guía de Despliegue - Pleyazul Oráculos

## Resumen del Proyecto

**Pleyazul Oráculos** es una PWA completa para consultas espirituales con tres sistemas oraculares:
- **Tarot** (78 cartas con interpretaciones completas)
- **I Ching** (64 hexagramas con sabiduría milenaria)
- **Rueda Medicinal** (Animales de poder nativos americanos)

## Estado Actual del Desarrollo

✅ **Funcionalidades Completadas:**
- Sistema completo de oráculos con lecturas personalizadas
- Modo demo gratuito y sistema de pagos con PayPal
- Panel de administración completo
- PWA con funcionalidad offline
- Integración con Telegram Bot
- Generación de PDFs
- Sistema de contenido JSON editable
- Soporte multimedia (imágenes y audio)
- Páginas legales (GDPR compliant)
- Meditaciones guiadas

✅ **Tecnologías Implementadas:**
- Next.js 14 (App Router)
- MongoDB
- PayPal API
- Telegram Bot API
- Tailwind CSS + shadcn/ui
- PWA (Service Worker + Manifest)

## Opciones de Despliegue

### 1. Vercel (Recomendado para Next.js)

**Ventajas:**
- Optimizado para Next.js
- Despliegue automático desde GitHub
- CDN global incluido
- SSL automático

**Pasos:**
1. Subir código a GitHub
2. Conectar repositorio en [vercel.com](https://vercel.com)
3. Configurar variables de entorno en Vercel Dashboard
4. Desplegar automáticamente

**Variables de Entorno Requeridas:**
```
MONGO_URL=tu_mongodb_connection_string
DB_NAME=pleyazul_oraculos
PAYPAL_CLIENT_ID=tu_paypal_client_id
PAYPAL_CLIENT_SECRET=tu_paypal_client_secret
PAYPAL_WEBHOOK_ID=tu_webhook_id
TELEGRAM_BOT_TOKEN=tu_telegram_token
ADMIN_PASSWORD=tu_admin_password
NEXT_PUBLIC_BASE_URL=https://tu-dominio.vercel.app
```

### 2. MongoDB Atlas (Base de Datos)

**Setup:**
1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crear cluster gratuito
3. Configurar usuario y contraseña
4. Obtener connection string
5. Añadir IP addresses al whitelist

### 3. Netlify (Alternativa)

**Pasos:**
1. Subir a GitHub
2. Conectar en [netlify.com](https://netlify.com)
3. Build command: `yarn build`
4. Publish directory: `.next`
5. Configurar variables de entorno

### 4. Railway (Para Full-Stack)

**Ventajas:**
- Soporte completo para MongoDB
- Fácil configuración
- Escalabilidad automática

**Pasos:**
1. Crear proyecto en [railway.app](https://railway.app)
2. Conectar repositorio GitHub
3. Añadir servicio MongoDB
4. Configurar variables de entorno
5. Desplegar

## Configuración de Integraciones

### PayPal Setup (Producción)

1. **Crear Aplicación:**
   - Ir a [developer.paypal.com](https://developer.paypal.com)
   - Crear aplicación "Live"
   - Copiar Client ID y Secret

2. **Configurar Webhook:**
   - URL: `https://tu-dominio.com/api/webhooks/paypal`
   - Eventos: `PAYMENT.CAPTURE.COMPLETED`
   - Copiar Webhook ID

3. **Variables de Entorno:**
   ```
   PAYPAL_ENV=live
   PAYPAL_CLIENT_ID=tu_live_client_id
   PAYPAL_CLIENT_SECRET=tu_live_client_secret
   PAYPAL_WEBHOOK_ID=tu_live_webhook_id
   ```

### Telegram Bot Setup

1. **Crear Bot:**
   - Hablar con [@BotFather](https://t.me/botfather)
   - Comando: `/newbot`
   - Seguir instrucciones
   - Copiar token

2. **Configurar Webhook:**
   ```bash
   curl -X POST \
     https://api.telegram.org/bot<TOKEN>/setWebhook \
     -d url=https://tu-dominio.com/api/webhooks/telegram
   ```

3. **Variable de Entorno:**
   ```
   TELEGRAM_BOT_TOKEN=tu_bot_token
   ```

## Lista de Verificación Pre-Despliegue

### ✅ Código y Contenido
- [ ] Código subido a GitHub
- [ ] README.md completo
- [ ] package.json actualizado con dependencias correctas
- [ ] Contenido de oráculos poblado (mínimo 10 cartas por oráculo)
- [ ] Imágenes añadidas a `/public/img/`
- [ ] Meditaciones con audio configuradas

### ✅ Configuración
- [ ] Variables de entorno configuradas
- [ ] MongoDB Atlas configurado
- [ ] PayPal aplicación creada (sandbox y live)
- [ ] Telegram bot creado
- [ ] Dominio personalizado configurado (opcional)

### ✅ Testing
- [ ] Modo demo funciona
- [ ] Checkout completo funciona
- [ ] Webhooks de PayPal configurados
- [ ] Bot de Telegram responde
- [ ] Generación de PDFs funciona
- [ ] Admin panel accesible

### ✅ Legal y Seguridad
- [ ] Términos y condiciones actualizados
- [ ] Política de privacidad GDPR compliant
- [ ] Contraseña admin cambiada
- [ ] SSL certificado activo
- [ ] Backups de base de datos configurados

## Comandos de Despliegue

### Local Development
```bash
# Instalar dependencias
yarn install

# Configurar .env
cp .env.example .env
# Editar .env con tus valores

# Iniciar desarrollo
yarn dev
```

### Build para Producción
```bash
# Build optimizado
yarn build

# Iniciar producción
yarn start
```

### Verificación Post-Despliegue
```bash
# Test API
curl https://tu-dominio.com/api/status

# Test webhooks
curl -X POST https://tu-dominio.com/api/demo/reading \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","spread_id":"tarot_3_ppf"}'
```

## Monitoreo y Mantenimiento

### Métricas Importantes
- Tiempo de respuesta de API
- Tasa de conversión checkout
- Errores en generación de lecturas
- Uso de base de datos
- Webhook delivery rate

### Logs a Monitorear
- Errores de PayPal webhook
- Fallos en generación de PDFs
- Timeouts de base de datos
- Errores de bot de Telegram

### Backups Recomendados
- Base de datos MongoDB (diario)
- Archivos de contenido JSON (semanal)
- Imágenes y assets (mensual)

## Soporte y Troubleshooting

### Problemas Comunes

**1. Webhook PayPal no funciona:**
- Verificar URL webhook en PayPal dashboard
- Comprobar logs de servidor
- Validar firma de webhook

**2. Bot Telegram no responde:**
- Verificar token en .env
- Comprobar configuración de webhook
- Revisar rate limits de Telegram

**3. Generación PDF falla:**
- Verificar memoria disponible
- Comprobar permisos de escritura
- Revisar dependencias de Puppeteer

**4. Lecturas no se generan:**
- Verificar contenido JSON válido
- Comprobar conexión MongoDB
- Revisar logs de contentService

### Contacto de Soporte

Para soporte técnico:
- Revisar panel admin en `/admin`
- Consultar logs del sistema
- Verificar status de integraciones

---

**¡Tu plataforma oracular está lista for el mundo! 🔮**