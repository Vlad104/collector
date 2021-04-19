const { Action } = require("./Action");

const EXPIRE_MS = 30 * 60 * 1000;

class Worker {
  constructor (config) {
    this.worker = config.worker;
    this.address = config.address;
    this.data = {};
    this.updatedAt = null;
    this.action = new Action();
  }

  isActual() {
    return !!this.updatedAt && (this.updatedAt + EXPIRE_MS > Date.now());
  }

  getAction () {
    const current = this.action.get();

    if (Action.isInstant(current)) {
      this.action.reset();
      return current;
    }

    if (!this.isActual()) {
      return Action.Types.SendData;
    }

    return current;
  }

  setRestartAction () {
    this.action.set(Action.Types.RestartCompuer);
  }

  getConfiguration () {
    return {
      worker: this.worker,
      address: this.address,
      updateTimeoutMs: 30000
    };
  }

  updateData (data) {
    this.data = data;
    this.action.reset();
    this.updatedAt = Date.now();
  }
}

module.exports.Worker = Worker;
