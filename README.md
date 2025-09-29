# Pleyazul Oráculos 🔮

Una PWA completa para consultas oraculares con Tarot, I Ching y Rueda Medicinal.

## Características Principales

### 🎯 Oráculos Disponibles
- **Tarot**: Cartas sagradas con interpretaciones completas (derecha/invertida)
- **I Ching**: Hexagramas del Libro de las Mutaciones con sabiduría milenaria
- **Rueda Medicinal**: Animales de poder y medicina ancestral nativa americana

### ✨ Funcionalidades
- **Modo Demo**: Lecturas gratuitas instantáneas para probar el sistema
- **Lecturas Completas**: Consultas pagadas con PDF descargable
- **PWA**: Aplicación web progresiva con funcionalidad offline
- **Responsive**: Diseño adaptativo para móvil, tablet y desktop
- **Admin Panel**: Panel de administración para gestionar contenido
- **Soporte Multimedia**: Imágenes para cartas/animales, audio para meditaciones

### 💳 Sistema de Pagos
- **PayPal Integration**: Procesamiento seguro de pagos
- **Test Mode**: Modo de prueba para desarrollo
- **Order Management**: Gestión completa de pedidos y lecturas

### 📱 Integraciones
- **Telegram Bot**: Envío de lecturas por Telegram
- **PDF Generation**: Generación automática de PDFs
- **Email Notifications**: Sistema de notificaciones por email

## Tecnologías Utilizadas

- **Frontend**: Next.js 14 + React
- **Backend**: Next.js API Routes + Node.js
- **Database**: MongoDB
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Payments**: PayPal API
- **Messaging**: Telegram Bot API
- **PWA**: Service Worker + Web Manifest

## Estructura del Proyecto

```
/app
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── admin/             # Panel de administración
│   ├── tiradas/           # Página de consultas
│   ├── checkout/          # Proceso de pago
│   ├── lectura/           # Resultados de lecturas
│   ├── meditaciones/      # Sección de meditaciones
│   └── legal/             # Páginas legales
├── content/               # Contenido JSON editable
│   ├── tarot.json         # Cartas del tarot
│   ├── iching.json        # Hexagramas del I Ching
│   ├── rueda.json         # Animales de la rueda
│   ├── spreads.json       # Configuraciones de tiradas
│   ├── presets.json       # Preguntas sugeridas
│   ├── meditaciones.json  # Contenido de meditaciones
│   └── schema/            # Esquemas de validación JSON
├── lib/                   # Utilidades y servicios
│   ├── mongodb.js         # Conexión a base de datos
│   ├── contentService.js  # Servicio de contenido
│   ├── paypal.js         # Integración PayPal
│   ├── telegram.js       # Bot de Telegram
│   └── pdfGenerator.js   # Generador de PDFs
├── public/               # Archivos estáticos
│   ├── img/              # Imágenes de cartas y animales
│   ├── audio/            # Archivos de audio
│   └── manifest.json     # PWA Manifest
└── components/           # Componentes UI reutilizables
```

## Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/YOUR_USERNAME/pleyazul-oraculos.git
cd pleyazul-oraculos
```

### 2. Instalar Dependencias
```bash
yarn install
```

### 3. Configurar Variables de Entorno
Crear archivo `.env` con:

```env
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=pleyazul_oraculos

# App URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
APP_BASE_URL=http://localhost:3000
CORS_ORIGINS=*

# PayPal (Sandbox)
PAYPAL_ENV=sandbox
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_ID=your_webhook_id

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_WEBHOOK_SECRET=your_webhook_secret

# Admin
ADMIN_PASSWORD=your_admin_password

# Development
TEST_MODE=true
```

### 4. Iniciar MongoDB
```bash
# Con Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# O instalar MongoDB localmente
```

### 5. Ejecutar la Aplicación
```bash
# Desarrollo
yarn dev

# Producción
yarn build
yarn start
```

## Configuración de Integraciones

### PayPal Setup
1. Crear cuenta en [PayPal Developer](https://developer.paypal.com)
2. Crear nueva aplicación
3. Copiar Client ID y Client Secret al `.env`
4. Configurar webhook: `YOUR_DOMAIN/api/webhooks/paypal`

### Telegram Bot Setup
1. Hablar con [@BotFather](https://t.me/botfather)
2. Crear nuevo bot con `/newbot`
3. Copiar token al `.env`
4. El webhook se configura automáticamente: `YOUR_DOMAIN/api/webhooks/telegram`

## Uso del Sistema

### Para Usuarios
1. Visitar la página principal
2. Hacer clic en "Pedir Lectura"
3. Elegir tipo de consulta
4. Probar con "Demo Gratis" o pagar con "€19.99"
5. Recibir lectura por email y/o Telegram

### Para Administradores
1. Acceder a `/admin` con contraseña
2. Revisar estado de integraciones
3. Gestionar contenido de oráculos
4. Monitorear pedidos y lecturas
5. Consultar guía de contenido

## Gestión de Contenido

### Estructura de Cartas de Tarot
```json
{
  "name": "El Loco",
  "upright": "Nuevos comienzos...",
  "reversed": "Imprudencia...",
  "love": {
    "upright": "...",
    "reversed": "..."
  },
  "work": {
    "upright": "...",
    "reversed": "..."
  },
  "health": {
    "upright": "...",
    "reversed": "..."
  },
  "advice": "Consejo general...",
  "image": "/img/tarot/el-loco.jpg"
}
```

### Añadir Imágenes
1. Subir imagen a `/public/img/tarot/` o `/public/img/rueda/`
2. Referenciar en JSON: `"image": "/img/tarot/carta.jpg"`
3. Se mostrará automáticamente en lecturas

### Añadir Meditaciones
1. Editar `/content/meditaciones.json`
2. Incluir campos: `titulo`, `descripcion`, `duracion`, `texto`
3. Opcional: `image` y `audio_url` para multimedia

## API Endpoints

### Contenido
- `GET /api/content/tarot` - Cartas de tarot
- `GET /api/content/iching` - Hexagramas I Ching
- `GET /api/content/rueda` - Animales rueda medicinal
- `GET /api/content/spreads` - Configuraciones de tiradas
- `GET /api/content/presets` - Preguntas sugeridas

### Lecturas
- `POST /api/demo/reading` - Generar lectura demo
- `POST /api/readings/generate` - Generar lectura pagada
- `GET /api/readings/{order_id}` - Obtener lectura

### Pagos
- `POST /api/checkout` - Crear orden de pago
- `POST /api/webhooks/paypal` - Webhook PayPal
- `POST /api/webhooks/telegram` - Webhook Telegram

### Admin
- `GET /api/admin/setup-status` - Estado del sistema
- `PUT /api/admin/content` - Actualizar contenido

## Respeto Cultural

La Rueda Medicinal es una tradición sagrada de los pueblos Dakota, Lakota y Nakota. Este proyecto honra y respeta estas tradiciones ancestrales, utilizándolas con el máximo respeto y reconocimiento de su origen cultural.

## Licencia

Este proyecto está diseñado para uso comercial de consultas espirituales. Todo el código y contenido son propiedad de Pleyazul Oráculos.

## Soporte

Para soporte técnico o consultas sobre el sistema, revisar:
- Panel de administración en `/admin`
- Guía de contenido en `/admin/content-guide`
- Logs del sistema para diagnóstico

---

**Desarrollado con ❤️ para conectar a las personas con la sabiduría ancestral** 🔮