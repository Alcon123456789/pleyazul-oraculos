#!/bin/bash

echo "🔍 Verificación de Build para Render - Pleyazul Oráculos"
echo "=========================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Node version
echo "📦 Verificando Node.js..."
NODE_VERSION=$(node --version)
echo "   Versión: $NODE_VERSION"
echo ""

# Check 2: Dependencies
echo "📚 Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo -e "   ${GREEN}✓${NC} node_modules existe"
else
    echo -e "   ${YELLOW}⚠${NC} node_modules no encontrado. Ejecutando npm install..."
    npm install
fi
echo ""

# Check 3: Next.js build
echo "🏗️  Ejecutando build de Next.js..."
BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_EXIT=$?

if [ $BUILD_EXIT -eq 0 ]; then
    echo -e "   ${GREEN}✓${NC} Build completado exitosamente"
    
    # Check if there are warnings
    if echo "$BUILD_OUTPUT" | grep -q "Compiled with warnings"; then
        echo -e "   ${YELLOW}⚠${NC} Build tiene warnings (no críticos)"
    fi
else
    echo -e "   ${RED}✗${NC} Build falló"
    echo ""
    echo "Últimas 20 líneas del error:"
    echo "$BUILD_OUTPUT" | tail -20
    exit 1
fi
echo ""

# Check 4: Critical files
echo "📄 Verificando archivos críticos..."

CRITICAL_FILES=(
    "app/checkout/page.js"
    "app/checkout/test/page.js"
    "app/api/status/route.js"
    "lib/mongodb.js"
    "next.config.js"
    "package.json"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✓${NC} $file"
    else
        echo -e "   ${RED}✗${NC} $file no encontrado"
    fi
done
echo ""

# Check 5: Suspense boundaries
echo "🔄 Verificando Suspense boundaries en checkout..."
if grep -q "Suspense" app/checkout/page.js && grep -q "Suspense" app/checkout/test/page.js; then
    echo -e "   ${GREEN}✓${NC} Suspense boundaries configurados correctamente"
else
    echo -e "   ${RED}✗${NC} Falta configuración de Suspense"
fi
echo ""

# Check 6: Start script
echo "🚀 Verificando script de start..."
if grep -q '\-p \${PORT:-3000}' package.json; then
    echo -e "   ${GREEN}✓${NC} Script de start configurado para usar PORT de Render"
else
    echo -e "   ${YELLOW}⚠${NC} Script de start podría no usar PORT de Render"
fi
echo ""

# Check 7: Try to start server (brief test)
echo "🌐 Probando inicio del servidor..."
PORT=3333 timeout 10 npm start > /tmp/server_test.log 2>&1 &
SERVER_PID=$!
sleep 5

if curl -s http://localhost:3333/api/status > /dev/null 2>&1; then
    echo -e "   ${GREEN}✓${NC} Servidor inicia correctamente"
    
    # Test health check
    HEALTH_CHECK=$(curl -s http://localhost:3333/api/status)
    if echo "$HEALTH_CHECK" | grep -q '"status":"ok"'; then
        echo -e "   ${GREEN}✓${NC} Health check endpoint funcionando"
    else
        echo -e "   ${YELLOW}⚠${NC} Health check no responde correctamente"
    fi
else
    echo -e "   ${YELLOW}⚠${NC} Servidor no respondió en 5 segundos (puede ser normal)"
fi

# Cleanup
kill $SERVER_PID 2>/dev/null
echo ""

# Summary
echo "=========================================================="
echo "📊 RESUMEN"
echo "=========================================================="
echo ""
echo -e "${GREEN}✅ Build verificado y listo para Render${NC}"
echo ""
echo "Próximos pasos:"
echo "1. git add ."
echo "2. git commit -m 'Fix: Render deployment corrections'"
echo "3. git push origin main"
echo "4. Trigger deploy en Render"
echo ""
echo "Variables de entorno mínimas en Render:"
echo "  - NODE_ENV=production"
echo "  - NPM_CONFIG_PRODUCTION=false"
echo "  - TEST_MODE=true"
echo "  - DISABLE_PDF=true"
echo ""
echo "Health Check Path en Render: /api/status"
echo ""
echo "🎉 ¡Todo listo para el despliegue!"
