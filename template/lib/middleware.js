const morgan = require('morgan');

module.exports = {
  logger() {
    morgan.token('body', ({ body }) => JSON.stringify(body));
    return morgan(':method :url HTTP/:http-version :status :res[content-length] - :response-time ms :body');
  },

  bodyParser() {
    return (req, res, next) => {
      let data = '';

      req.on('data', chunk => {
        data += chunk;
      });

      req.on('end', () => {
        try {
          req.body = JSON.parse(data);
          next();
        } catch (err) {
          console.error(err);
          req.body = data;
          res.status(200).send('Throw invalid json (force ack).');
        }
      });
    };
  }
}
