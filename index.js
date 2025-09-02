const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Хранилище данных (пока просто в памяти)
const chatData = {
  lastMessage: null, // Последнее сообщение в чате
  messageCount: 0,   // Счетчик сообщений для рандомных реакций
};

// Списки реакций
const memes = [
  'https://i.imgur.com/example1.jpg', // Замени на реальные ссылки!
  'https://i.imgur.com/example2.png',
];

const stickers = [
  'CAACAgIAAxkBAAIB...', // Замени на реальные ID стикеров!
  'CAACAgQAAxkBAAIB...',
];

const phrasesAboutBeer = [
  'я только подумал о пиве и тут на нахуй!',
  'пей пиво пенное — будет жизнь отменная!',
  'как говорит Жека Горловой - Саня насос пивной)',
  'лучше пиво в руке, чем девица вдалеке',
  'у человека всегда должно быть горячее сердце и холодное пиво!',
];
const phrasesAboutGellert = [
  'Геллерт конечно для петухов, но можно и сгонять на пару кружек',
  'бля, как вас не заебал ещё этот геллерт',
  'кстати, у Сани в геллерте по понедельникам одинокие бабы сидят',
  'что-то тоже захотелось в Геллерт...',
];

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const text = `О да! Я жив! Ваш папич-бот на связи. 👻

Я реагирую на сообщения в чате! Попробуй написать:
• "скучно" или "нудно"
• "как дела"
• "го есть" или "шаурма"
• Или просто общайтесь, я иногда отвечаю рандомно!

Команды:
/meme - кину случайный мем
/sticker - кину случайный стикер
/action - выдам рандомный приказ
/repeat - повторю последнее сообщение капсом
  `;
  bot.sendMessage(chatId, text);
});

// Обработчик ВСЕХ сообщений
bot.on('message', (msg) => {
  // Игнорируем служебные сообщения и команды
  if (!msg.text || msg.text.startsWith('/')) return;

  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();
  const userName = msg.from.first_name;

  // Сохраняем последнее сообщение
  chatData.lastMessage = msg;
  chatData.messageCount++;

  // Реакция на смех
  if (text.includes('аха') || text.includes('ахах')) {
    bot.sendMessage(chatId, `и хули угараем то ${userName}?`);
  }

  // Реакция на заебись
  if (text.includes('заебись') || text.includes('охуенно') || text.includes('ахуенно') || text.includes('ахуенно') || text.includes('хуен') ) {
   
    setTimeout(() => {
      bot.sendMessage(chatId, `бля, бесспорно ЗАЕБИСЬ ${userName}`);
    }, 1000);
  }

  // Реакция на Геллерт
  if (text.includes('Геллерт') || text.includes('гелю') || text.includes('геля') || text.includes('еллерт')) {
    const randomPhrase = phrasesAboutGellert[Math.floor(Math.random() * phrasesAboutGellert.length)];

    setTimeout(() => {
      bot.sendMessage(chatId, `${randomPhrase}`)
    }, 2000);
  }

  // Реакция на вопрос о делах
  if (text.includes('как дела') || text.includes('че как')) {
    setTimeout(() => {
      bot.sendMessage(chatId, `с пивком пойдёт, ${userName}! А у тебя чё как?`, {
        reply_to_message_id: msg.message_id
      });
    }, 1000);
  }

  // Реакция на пиво
  if (text.includes('пиво') || text.includes('пивной') || text.includes('пив') || text.includes('пивка')) {
    const randomPhrase = phrasesAboutBeer[Math.floor(Math.random() * phrasesAboutBeer.length)];
    setTimeout(() => {
      bot.sendMessage(chatId, `Ебать, ${userName}! ${randomPhrase}`, {
        reply_to_message_id: msg.message_id
      });
    }, 1000);
  }


  // Рандомная реакция (примерно на каждое 2-3-е сообщение)
  if (Math.random() < 0.5) {
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setTimeout(() => {
      bot.sendMessage(chatId, randomPhrase, {
        reply_to_message_id: msg.message_id
      });
    }, 2000);
  }
});

// Команда /meme
bot.onText(/\/meme/, (msg) => {
  const chatId = msg.chat.id;
  const randomMeme = memes[Math.floor(Math.random() * memes.length)];
  bot.sendPhoto(chatId, randomMeme);
});

// Команда /sticker
bot.onText(/\/sticker/, (msg) => {
  const chatId = msg.chat.id;
  const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
  bot.sendSticker(chatId, randomSticker);
});

// Команда /repeat
bot.onText(/\/repeat/, (msg) => {
  const chatId = msg.chat.id;
  if (!chatData.lastMessage) {
    bot.sendMessage(chatId, 'Я еще ничего не запомнил...');
    return;
  }
  const textToRepeat = chatData.lastMessage.text.toUpperCase();
  bot.sendMessage(chatId, textToRepeat, {
    reply_to_message_id: chatData.lastMessage.message_id
  });
});

console.log('Бот-оживитель чата запущен! 🚀');