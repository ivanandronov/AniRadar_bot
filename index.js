const TelegramBot = require('node-telegram-bot-api');
const token = '1313427974:AAHEk47YSlsklmogBTN39Yf1q_xQh6EKMwU';
const { genre } = require('jikan-nodejs');
// const request = require('request')
// const fetch = require('node-fetch')
// const { resolve } = require('path');
const bot = new TelegramBot(token, {polling: {
  interval: 300,
  autoStart: true,
  params: {
    timeout: 10,
  }
}
});

async function getAnimesByGenre(x) {
  const animes = await genre.animesByGenre(x, { limit: 25 }); // parameters: genreId, { limit }
  return animes; 
}
async function doJob (msg, k) {
  const y = Math.floor(Math.floor(Math.random() * 25));
  const response = await getAnimesByGenre(k);
  const id = msg.chat.id;
  const res = response.results[y]
  if (res === undefined) {
    await bot.sendMessage(id, 'i am not feeling well today, please try again')
  } else {

    await bot.sendPhoto(id, res.image_url, {caption:`Название: ${res.title}`} )
    await bot.sendMessage(id, 'Краткое описание: '+ res.synopsis)
    await bot.sendMessage(id, 'Количество эпизодов: '+ res.episodes, {
      reply_markup: {
        inline_keyboard: [
          [{
              text: 'Ссылка на тайтл на MyAnimeList: ',
              url: res.url
            }]
          ],
          resize_keyboard: true,
        }
    })
  }
}

bot.onText(/\/start/, msg => {
  const {id} = msg.chat;
  bot.sendMessage(id, 'Привет! Выбери жанр, который тебя интересует, и я помогу тебе выбрать тайтл!', {
    reply_markup: {
      keyboard: [
        ['Хочу экшн!', 'Хочу сёдзе!', 'Хочу про психологию!'],
        ['Хочу драки!', 'Хочу фэнтэзи!'],//, 'Хочу Юри))(18+!)'],
        ['Хочу ужасы!','Хочу про загадки!', 'Хочу про историю!'],
        ['Автопортрет создателя :blush:']//[ 'Узнать новое слово на японском!'],
      ],
      resize_keyboard: true,
    },
    })
})

bot.onText(/\/help/, msg => {
  const {id} = msg.chat;
  bot.sendMessage(id, 'Im all yours, senpai!')
})

bot.on('message', async (msg) => {
  console.log('////////////// '+ vibeCheck () + ' написал: ' + msg.text);  
  if(msg.text === 'Автопортрет создателя :blush:'){
    bot.sendPhoto(msg.chat.id, 'https://sun1-28.userapi.com/E2KCW1JpoOTyOflCDQAgC5pTH4RFbVjjxC485A/BLKVsMGTacM.jpg', {caption: 'That\'s me!'})
  } else if (msg.text === 'Узнать новое слово на японском!') {
    bot.sendMessage(msg.chat.id, 'радость - 喜び (Yorokobi)')
  } else if (msg.text === 'Хочу экшн!') {
    await bot.sendMessage(msg.chat.id, 'Показываю экшн:')
    await doJob(msg, 1)
  } else if (msg.text === 'Хочу сёдзе!') {
    await bot.sendMessage(msg.chat.id, 'Показываю сёдзе:')
    await doJob(msg, 25)
  } else if (msg.text === 'Хочу драки!') {
    await bot.sendMessage(msg.chat.id, 'Показываю про драки:')
    await doJob(msg, 17)
  } else if (msg.text === 'Хочу фэнтэзи!'){
    await bot.sendMessage(msg.chat.id, 'Показываю фэнтэзи:')
    await doJob(msg, 10)
  } else if (msg.text === 'Хочу Юри))(18+!)') {
    await bot.sendMessage(msg.chat.id, 'Показываю Юри)):')
    await doJob(msg, 34)
  } else if (msg.text === 'Хочу про психологию!') {
    await bot.sendMessage(msg.chat.id, 'Показываю про психологию:')
    await doJob(msg, 40)
  } else if (msg.text === 'Хочу про загадки!') {
    await bot.sendMessage(msg.chat.id, 'Показываю про загадки:')
    await doJob(msg, 7)
  } else if (msg.text === 'Хочу ужасы!') {
    await bot.sendMessage(msg.chat.id, 'Показываю ужасы:')
    await doJob(msg, 14)
  } else if (msg.text === 'Хочу про историю!') {
    await bot.sendMessage(msg.chat.id, 'Показываю про историю:')
    await doJob(msg, 13)
  };

function vibeCheck () {
  if (msg.from.username === undefined) {
    if(msg.from.first_name === undefined) {
      return msg.from.last_name
    } else if (msg.from.last_name === undefined) {
      return msg.from.first_name
    } else {
      return msg.from.first_name + ' ' + msg.from.last_name
    }
  } else {
    return msg.from.username
  }
}

})
