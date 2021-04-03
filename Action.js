class Action {
  constructor() {
    this.action = Action.Types.AskConfiguration;
  }

  static Types = {
    Nothing: 0,
    AskConfiguration: 1,
    SendData: 2,
    RestartCompuer: 3
  };

  static isInstant (action) {
    return action === Action.Types.RestartCompuer;
  }

  get() {
    return this.action;
  }
  
  set(action) {
    this.action = action;
  }
  
  reset() {
    this.action = Action.Types.Nothing;
  }
}

module.exports.Action = Action
