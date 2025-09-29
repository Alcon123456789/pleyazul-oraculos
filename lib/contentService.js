import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const SCHEMA_DIR = path.join(CONTENT_DIR, 'schema');

class ContentService {
  constructor() {
    this.cache = new Map();
  }

  // Load JSON content with caching
  loadContent(type) {
    if (this.cache.has(type)) {
      return this.cache.get(type);
    }

    try {
      const filePath = path.join(CONTENT_DIR, `${type}.json`);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      this.cache.set(type, content);
      return content;
    } catch (error) {
      console.error(`Error loading ${type} content:`, error);
      return null;
    }
  }

  // Save JSON content and clear cache
  saveContent(type, content) {
    try {
      const filePath = path.join(CONTENT_DIR, `${type}.json`);
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
      this.cache.delete(type); // Clear cache
      return true;
    } catch (error) {
      console.error(`Error saving ${type} content:`, error);
      return false;
    }
  }

  // Load schema for validation
  loadSchema(type) {
    try {
      const schemaPath = path.join(SCHEMA_DIR, `${type}.schema.json`);
      return JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    } catch (error) {
      console.error(`Error loading ${type} schema:`, error);
      return null;
    }
  }

  // Generate reproducible random numbers from seed
  seededRandom(seed, min = 0, max = 1) {
    const hash = crypto.createHash('sha256').update(seed).digest('hex');
    const num = parseInt(hash.substring(0, 8), 16) / 0xffffffff;
    return Math.floor(num * (max - min + 1)) + min;
  }

  // Generate multiple seeded random numbers
  seededRandomArray(seed, count, min = 0, max = 1) {
    const results = [];
    for (let i = 0; i < count; i++) {
      const iterSeed = `${seed}_${i}`;
      results.push(this.seededRandom(iterSeed, min, max));
    }
    return results;
  }

  // Generate reading based on spread configuration
  generateReading(orderId, email, spreadId) {
    const spreads = this.loadContent('spreads');
    const spread = spreads[spreadId];
    
    if (!spread) {
      throw new Error(`Spread ${spreadId} not found`);
    }

    const seed = crypto.createHash('sha256').update(`${orderId}_${email}`).digest('hex');
    
    switch (spread.oraculo) {
      case 'tarot':
        return this.generateTarotReading(spread, seed);
      case 'iching':
        return this.generateIChingReading(spread, seed);
      case 'rueda':
        return this.generateRuedaReading(spread, seed);
      default:
        throw new Error(`Unknown oracle type: ${spread.oraculo}`);
    }
  }

  generateTarotReading(spread, seed) {
    const tarot = this.loadContent('tarot');
    if (!tarot || tarot.length === 0) {
      throw new Error('Tarot content not available');
    }

    const cards = [];
    const usedIndexes = new Set();
    
    for (let i = 0; i < spread.cartas; i++) {
      let cardIndex;
      do {
        cardIndex = this.seededRandom(`${seed}_card_${i}`, 0, tarot.length - 1);
      } while (usedIndexes.has(cardIndex));
      
      usedIndexes.add(cardIndex);
      
      const card = tarot[cardIndex];
      const isReversed = this.seededRandom(`${seed}_reversed_${i}`, 0, 1) === 1;
      
      cards.push({
        ...card,
        reversed: isReversed,
        position: spread.posiciones ? spread.posiciones[i] : `Carta ${i + 1}`,
        interpretation: isReversed ? card.reversed : card.upright
      });
    }

    return {
      type: 'tarot',
      spread: spread,
      cards: cards,
      message: 'Las cartas han sido elegidas. Confía en su sabiduría.',
      timestamp: new Date().toISOString()
    };
  }

  generateIChingReading(spread, seed) {
    const iching = this.loadContent('iching');
    if (!iching || iching.length === 0) {
      throw new Error('I Ching content not available');
    }

    const hexIndex = this.seededRandom(seed, 0, iching.length - 1);
    const hexagram = iching[hexIndex];

    return {
      type: 'iching',
      spread: spread,
      hexagram: hexagram,
      message: 'El I Ching revela su sabiduría milenaria.',
      timestamp: new Date().toISOString()
    };
  }

  generateRuedaReading(spread, seed) {
    const rueda = this.loadContent('rueda');
    if (!rueda || rueda.length === 0) {
      throw new Error('Rueda Medicinal content not available');
    }

    const animals = [];
    const usedIndexes = new Set();
    
    for (let i = 0; i < spread.cartas; i++) {
      let animalIndex;
      do {
        animalIndex = this.seededRandom(`${seed}_animal_${i}`, 0, rueda.length - 1);
      } while (usedIndexes.has(animalIndex));
      
      usedIndexes.add(animalIndex);
      
      const animal = rueda[animalIndex];
      
      animals.push({
        ...animal,
        position: spread.posiciones ? spread.posiciones[i] : `Animal ${i + 1}`
      });
    }

    return {
      type: 'rueda',
      spread: spread,
      animals: animals,
      message: 'Los animales de poder han sido llamados para guiarte.',
      timestamp: new Date().toISOString()
    };
  }

  // Clear all cache
  clearCache() {
    this.cache.clear();
  }
}

// Singleton instance
const contentService = new ContentService();
export default contentService;