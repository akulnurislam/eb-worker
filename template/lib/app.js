const express = require('express');
const middleware = require('./middleware');
const Worker = require('../Worker');
const { name, version } = require('../package');

const app = express();
const worker = new Worker();
const PORT = process.env.PORT || 3000;

app.use(middleware.logger());
app.use(middleware.bodyParser());

app.post('/', async (req, res) => {
  try {
    await worker.main(req.body);
    res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.info(`worker: ${name} version: ${version} port: ${PORT}`);
});
