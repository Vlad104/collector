const workers = require('../Workers');

function action (req, res) {
  const { worker: workerName } = req.body;

  const worker = workers.get(workerName);
  const action = worker.getAction();

  res.json({ action });
}

function configuration (req, res) {
  const { worker: workerName } = req.body;

  const worker = workers.get(workerName);
  const configuration = worker.getConfiguration();

  res.json(configuration);
}

function data (req, res) {
  const { worker: workerName } = req.body;

  const worker = workers.get(workerName);
  worker.updateData(req.body);

  res.json({});
}

module.exports = {
  action, configuration, data
}
