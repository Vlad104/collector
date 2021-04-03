const defaultConfig = require('./config.json');
const { Worker } = require("./Worker");

class Workers {
  constructor(config) {
    this.workers = {};

    for (const key in config) {
      this.workers[key] = new Worker(config[key]);
    }
  }

  get (worker) {
    return this.workers[worker];
  }

  all () {
    return Object.values(this.workers).filter(w => w.isActual()).map(w => w.data);
  }
}

module.exports = new Workers(defaultConfig.workers);
