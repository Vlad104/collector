const { Workers: WorkersConfig } = require('./config');
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

  list () {
    const notSortedWorkers = Object.values(this.workers);
    const activeWorkers = notSortedWorkers.filter(w => w.isActual());
    const notActiveWorkers = notSortedWorkers.filter(w => !w.isActual());
    const workers = [...activeWorkers, ...notActiveWorkers];

    return workers.reduce((acc, worker) => {
      return `${acc}| ${worker.worker} | active: ${worker.isActual()} | cards: ${worker.data.gpu ? worker.data.gpu.length : '-'} | hashrate: ${worker.data.mining ? worker.data.mining.data : '-'} |\n`;
    }, '')
  }
}

module.exports = new Workers(WorkersConfig);
