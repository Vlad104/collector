

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const defaultConfig = require('../config.json')
const _ = require('lodash');
const workers = require('../Workers');

const { serialize, makeButton, makeOptions } = require('../utils')

const commands = ['Info', 'Restart', 'All'];

const commandsButtons = [commands.map(command => makeButton(command))];
const workersButtonsInfo = _.chunk(Object.keys(defaultConfig.workers).map(key => makeButton(key, 'Info')), [size=5]);
const workersButtonsRestart = _.chunk(Object.keys(defaultConfig.workers).map(key => makeButton(key, 'Restart')), [size=5]);

Object.keys(defaultConfig.workers)

bot.on('message', (message) => {
  const key = message.text.toUpperCase();

  bot.sendMessage(message.chat.id, 'Действие', makeOptions(commandsButtons));
});

bot.on('callback_query', function (message) {
  if (message.data === 'All') {
    bot.sendMessage(message.from.id, serialize(workers.all()));
    return;
  }

  if (message.data === 'Info') {
    bot.sendMessage(message.from.id, 'Воркер', makeOptions(workersButtonsInfo));
    return;
  }

  if (message.data === 'Restart') {
    bot.sendMessage(message.from.id, 'Воркер', makeOptions(workersButtonsRestart));
    return;
  }

  const [prefix, workerName] = message.data.split('_')

  if (prefix === 'Info') {
    const worker = workers.get(workerName);
    bot.sendMessage(message.from.id, serialize(worker.data));
    return;
  }

  if (prefix === 'Restart') {
    const worker = workers.get(workerName);
    worker.setRestartAction()
    bot.sendMessage(message.from.id, `Воркеру ${workerName} отправлена команда на перезагрузку`);
    return;
  }
});

bot.on("polling_error", console.log);
