import TelegramBot from 'node-telegram-bot-api';

// Singleton pattern to avoid multiple instances
let botInstance = null;

export function getTelegramBot() {
  if (!botInstance) {
    // Only create a bot instance on the server
    if (typeof window === 'undefined') {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      
      if (!token || token === '<to be added later>') {
        console.warn('TELEGRAM_BOT_TOKEN is not configured');
        return null;
      }
      
      botInstance = new TelegramBot(token);
    }
  }
  
  return botInstance;
}

// Helper function to escape special characters for MarkdownV2
export function escapeMarkdownV2(text) {
  const specialChars = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];
  let escapedText = text;
  
  for (const char of specialChars) {
    escapedText = escapedText.replace(new RegExp('\\' + char, 'g'), '\\' + char);
  }
  
  return escapedText;
}

// Send a message to a specific chat
export async function sendTelegramMessage(chatId, message, parseMode = '') {
  const bot = getTelegramBot();
  
  if (!bot) {
    console.warn('Telegram bot not configured');
    return { success: false, error: 'Bot not configured' };
  }
  
  const options = {};
  if (parseMode) {
    options.parse_mode = parseMode;
    
    // Escape special characters for MarkdownV2
    if (parseMode === 'MarkdownV2') {
      message = escapeMarkdownV2(message);
    }
  }
  
  try {
    const result = await bot.sendMessage(chatId, message, options);
    return { success: true, messageId: result.message_id };
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return { success: false, error: error.message };
  }
}

// Check if Telegram is configured
export function isTelegramConfigured() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  return token && token !== '<to be added later>';
}