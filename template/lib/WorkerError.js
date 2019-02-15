class WorkerError extends Error {
  constructor(status, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WorkerError);
    }

    this.status = status;
  }
}

module.exports = WorkerError;
