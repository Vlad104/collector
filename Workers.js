const { Workers: WorkersConfig } = require('./config');
const { Worker } = require("./Worker");

class Workers {
  constructor(config) {
    this.workers = {};

    for (const cfg of config) {
      this.workers[cfg.worker] = new Worker(cfg);
    }
  }

  get (worker) {
    return this.workers[worker];
  }

  all () {
    return Object.values(this.workers).filter(w => w.isActual()).map(w => w.data);
  }

  temperatures () {
    const notSortedWorkers = Object.values(this.workers);
    const activeWorkers = notSortedWorkers.filter(w => w.isActual());
    const notActiveWorkers = notSortedWorkers.filter(w => !w.isActual());
    const workers = [...activeWorkers, ...notActiveWorkers];

    return workers.reduce((acc, worker) => {
      const temperatures = (worker.data.gpu || []).reduce((acc, card) => `${acc} - ${card.temperatureGpu}`, '')

      return `${acc}| ${worker.worker} | ${temperatures} |\n`;
    }, '');
  }

  list () {
    const notSortedWorkers = Object.values(this.workers);
    const activeWorkers = notSortedWorkers.filter(w => w.isActual());
    const notActiveWorkers = notSortedWorkers.filter(w => !w.isActual());
    const workers = [...activeWorkers, ...notActiveWorkers];

    return workers.reduce((acc, worker) => {
      return `${acc}| ${worker.worker} | active: ${worker.isActual()} | cards: ${worker.data.gpu ? worker.data.gpu.length : '-'} | hashrate: ${worker.data.mining ? worker.data.mining.data : '-'} |\n`;
    }, '');
  }
}

module.exports = new Workers(WorkersConfig);
