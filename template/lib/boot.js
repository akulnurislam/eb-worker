const dotenv = require('dotenv');
const WorkerError = require('./WorkerError');

dotenv.load();
global.WorkerError = WorkerError;
