'use strict';

const retry = async (runnable, timeout = 500, times = 20) => {
  try {
    return await runnable();
  } catch (e) {
    if (times === 0) {
      throw e;
    }
    return await retry(runnable, timeout, times - 1);
  }
};

module.exports = retry;