'use strict';

module.exports = {
  process() {
    process.exit(0);
  },
  get description() {
    return [
      {command: 'exit', description: 'Closes the application'}
    ];
  }
};