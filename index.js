require('dotenv').config()
const express = require('express')
const app = express()
const { action, configuration, data } = require('./controllers/workers');

require('./controllers/bot')

app.use(express.json());

app.post('/action', (req, res) => action(req, res));
app.post('/configuration', (req, res) => configuration(req, res));
app.post('/data', (req, res) => data(req, res));

app.listen(3000);
