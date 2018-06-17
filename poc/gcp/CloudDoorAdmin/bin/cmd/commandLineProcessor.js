'use strict';

const readline = require('readline');
const clientProcessor = require('./clientProcessor');

const COMMAND_FEED = '> ';

const processors = {
  client: (command, processor) => clientProcessor(command, processor.client.clientManager),
  help: require('./helpProcessor'),
  exit: () => process.exit(0)
};

module.exports.CommandLineProcessor = class {

  constructor(client) {
    this.client = client;
  }

  start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });
    console.clear();
    process.stdout.write(COMMAND_FEED);

    rl.on('line', async line => {
      line = line.trim().toLowerCase();
      const parsedLine = line.match(/([a-z]+)[ ]*(.*)/);
      if (parsedLine && processors[parsedLine[1]]) {
        try {
          await processors[parsedLine[1]](parsedLine[2], this);
        } catch (err) {
          console.log(err);
        }
      } else {
        console.error(`Unrecognised command ${line}`);
      }

      process.stdout.write(COMMAND_FEED);
    });
  }

};