

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const { Workers: WorkersConfig } = require('../config')
const _ = require('lodash');
const workers = require('../Workers');

const { serialize, makeButton, makeOptions } = require('../utils')

const commands = ['Info', 'Restart', 'All', 'Temp'];

const commandsButtons = [commands.map(command => makeButton(command))];
const workersButtonsInfo = _.chunk(WorkersConfig.map(key => makeButton(key, 'Info')), [size=5]);
const workersButtonsRestart = _.chunk(WorkersConfig.map(key => makeButton(key, 'Restart')), [size=5]);

bot.on('message', (message) => {
  const key = message.text.toUpperCase();
  const [cmd, workerName, arg] = key.split(' ');

  if (cmd === 'R') {
    const worker = workers.get(workerName);

    if (worker && arg) {
      setTimeout(() => {
        worker.setRestartAction();
      }, parseInt(arg) * 60 * 1000);
      bot.sendMessage(message.chat.id, `Таймер на рестарт черер ${arg} минут установлен для воркера ${worker}`);
      return;
    }
  }

  if (cmd === 'XX') {
    const worker = workers.get(workerName);

    if (worker && arg) {
      setTimeout(() => {
        worker.setRestartAction();
      }, parseInt(arg) * 60 * 1000);
      bot.sendMessage(message.chat.id, `Таймер на рестарт черер ${arg} минут установлен для воркера ${worker}`);
      return;
    }
  }

  bot.sendMessage(message.chat.id, 'Действие', makeOptions(commandsButtons));
});

bot.on('callback_query', function (message) {
  if (message.data === 'All') {
    bot.sendMessage(message.from.id, workers.list());
    return;
  }

  if (message.data === 'Temp') {
    bot.sendMessage(message.from.id, workers.temperatures());
    return;
  }

  if (message.data === 'Info') {
    bot.sendMessage(message.from.id, 'Инфо', makeOptions(workersButtonsInfo));
    return;
  }

  if (message.data === 'Restart') {
    bot.sendMessage(message.from.id, 'Перезагрузка', makeOptions(workersButtonsRestart));
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
