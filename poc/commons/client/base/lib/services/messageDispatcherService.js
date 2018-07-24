'use strict';

const PROCESSOR_MAP = Object.freeze({
  browse: require('./processors/browseProcessor'),
  upload: require('./processors/uploadProcessor')
});

class UnsupportedOperationError extends Error {
  constructor(operation) {
    super(`Unsupported request type ${operation}`);
  }
}

module.exports.dispatch = message => {
  const processor = PROCESSOR_MAP[message.operation];
  if (!processor) {
    console.error(`Unsupported request type ${message.operation}`);
    throw new UnsupportedOperationError(message.operation);
  }
  return processor(message.details);
};