import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Generate PDF from reading data
export async function generateReadingPDF(reading, orderData) {
  try {
    const html = generateReadingHTML(reading, orderData);
    
    // For now, we'll use a simple approach
    // In production, you might want to use puppeteer for better PDF generation
    const pdfPath = path.join(process.cwd(), 'public', 'pdfs', `lectura_${orderData.orderId}.pdf`);
    
    // Ensure directory exists
    const dir = path.dirname(pdfPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // For now, just save as HTML (we can enhance this later with actual PDF generation)
    const htmlPath = path.join(process.cwd(), 'public', 'pdfs', `lectura_${orderData.orderId}.html`);
    fs.writeFileSync(htmlPath, html, 'utf8');
    
    return {
      success: true,
      pdfUrl: `/pdfs/lectura_${orderData.orderId}.html`,
      htmlUrl: `/pdfs/lectura_${orderData.orderId}.html`
    };
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Generate HTML template for reading
function generateReadingHTML(reading, orderData) {
  const date = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let contentHTML = '';
  
  if (reading.type === 'tarot') {
    contentHTML = `
      <div class="reading-content">
        <h2>Lectura de Tarot</h2>
        <p class="spread-name">Tirada: ${reading.spread.posiciones ? reading.spread.posiciones.join(' - ') : 'Lectura Personal'}</p>
        
        <div class="cards-section">
          ${reading.cards.map((card, index) => `
            <div class="card-interpretation">
              <h3>${card.position}</h3>
              <h4>${card.name} ${card.reversed ? '(Invertida)' : ''}</h4>
              <p><strong>Significado:</strong> ${card.interpretation}</p>
              <p><strong>Consejo:</strong> ${card.advice}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (reading.type === 'iching') {
    contentHTML = `
      <div class="reading-content">
        <h2>Consulta del I Ching</h2>
        <h3>Hexagrama ${reading.hexagram.hex}: ${reading.hexagram.nombre}</h3>
        
        <div class="hexagram-section">
          <p><strong>Palabras Clave:</strong> ${reading.hexagram.palabras_clave.join(', ')}</p>
          <p><strong>Juicio:</strong> ${reading.hexagram.juicio}</p>
          <p><strong>Imagen:</strong> ${reading.hexagram.imagen}</p>
          <p><strong>Consejo:</strong> ${reading.hexagram.consejo}</p>
        </div>
      </div>
    `;
  } else if (reading.type === 'rueda') {
    contentHTML = `
      <div class="reading-content">
        <h2>Medicina de la Rueda Sagrada</h2>
        
        <div class="animals-section">
          ${reading.animals.map((animal, index) => `
            <div class="animal-interpretation">
              <h3>${animal.position}</h3>
              <h4>${animal.animal} - ${animal.arquetipo}</h4>
              <p><strong>Luz:</strong> ${animal.luz}</p>
              <p><strong>Sombra:</strong> ${animal.sombra}</p>
              <p><strong>Medicina:</strong> ${animal.medicina}</p>
              <p><strong>Afirmación:</strong> ${animal.afirmacion}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lectura Pleyazul - ${orderData.orderId}</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #8B4513;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #8B4513;
          font-size: 2.5em;
          margin: 0;
        }
        .date {
          color: #666;
          font-style: italic;
        }
        .card-interpretation, .animal-interpretation {
          margin: 20px 0;
          padding: 15px;
          border-left: 4px solid #8B4513;
          background: #f9f9f9;
        }
        .card-interpretation h3, .animal-interpretation h3 {
          color: #8B4513;
          margin-top: 0;
        }
        .disclaimer {
          margin-top: 40px;
          padding: 20px;
          background: #f0f0f0;
          border-radius: 5px;
          font-size: 0.9em;
          text-align: center;
        }
        .spiritual-note {
          margin-top: 30px;
          padding: 15px;
          background: #e8f5e8;
          border-radius: 5px;
          font-style: italic;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔮 Pleyazul Oráculos</h1>
        <p class="date">Lectura realizada el ${date}</p>
        <p>Para: ${orderData.email}</p>
      </div>
      
      ${contentHTML}
      
      <div class="spiritual-note">
        <p><strong>Mensaje Espiritual:</strong> ${reading.message}</p>
      </div>
      
      <div class="disclaimer">
        <p><strong>Disclaimer:</strong> Este servicio es de carácter espiritual y recreativo. No sustituye el asesoramiento médico, legal o profesional.</p>
        <p>Honramos las tradiciones Dakota, Lakota y Nakota en el uso respetuoso de la Rueda Medicinal.</p>
      </div>
    </body>
    </html>
  `;
}