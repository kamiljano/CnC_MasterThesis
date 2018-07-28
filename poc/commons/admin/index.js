'use strict';

const readline = require('readline');
const helpProcessor = require('./bin/cmd/helpProcessor');

const COMMAND_FEED = '> ';

const processors = {
  help: {
    process: () => helpProcessor.process(processors),
    description: helpProcessor.description
  },
  client: require('./bin/cmd/clientProcessor'),
  exit: require('./bin/cmd/exitProcessor')
};

module.exports.AdminCommandLineProcessor = class {

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
      line = line.trim();
      const parsedLine = line.match(/([a-z]+)[ ]*(.*)/i);
      if (parsedLine && processors[parsedLine[1]]) {
        try {
          await processors[parsedLine[1]].process(parsedLine[2], this.client);
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