class Worker {
  async main(body, headers) {
    /**
     * logic here
     * 
     * just throw WorkerError when something wrong
     * 
     * throw new WorkerError(status, message) -> status is response http status
     * if you want force ack at sqs. 200 == ack
     */

    if (!body.valid) {
      throw new WorkerError(200, 'NOT VALID');
    }

    /**
     * done
     * without return anything
     */
  }
}

module.exports = Worker;
