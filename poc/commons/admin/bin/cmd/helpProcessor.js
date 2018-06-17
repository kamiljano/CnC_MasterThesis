'use strict';

module.exports = {
  process(processors) {
    console.log('The application supports the following commands:');
    for (const processorId in processors) {
      if (!processors[processorId].description) {
        console.error(`!!!No command description for "${processorId}"`);
        continue;
      }
      for (const description of processors[processorId].description) {
        console.log(`\t${description.command}\t\t${description.description}`);
      }
      console.log('');
    }
  },

  get description() {
    return [
      {command: 'help', description: 'Displays the application help'}
    ];
  }
};