'use strict';

const errorToString = err => {
  if (!err) {
    return 'unknown';
  }
  if (err.stack) {
    return err.stack;
  }
  if (typeof err === 'object') {
    return JSON.stringify(err);
  }
  return err;
};

module.exports.retryOnError = async runnable => {
  while(true) {
    try {
      await runnable();
      break;
    } catch(err) {
      console.error(`An error occurred during the execution of the application: ${errorToString(err)}`);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
};