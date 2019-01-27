'use strict';

const commandLineArgs = require('command-line-args');
const { RemoteClient } = require('./lib/remoteClient');
const path = require('path');
const fs = require('fs');
const {retry} = require('e2e');

const options = commandLineArgs([
  {name: 'clients', type: Number, defaultValue: 1},
  {name: 'endpoint', type: String}
]);

if (!options.endpoint) {
  console.error('The --endpoint parameter is mandatory');
  return;
}

const output = path.join(__dirname, '../../../generatedStats/azure/performance.csv');

if (fs.existsSync(output)) {
  fs.unlinkSync(output);
}

const logTime = async (clientNo, runnable) => {
  const start = new Date().getTime();
  await runnable();
  const duriation = new Date().getTime() - start;
  if (output) {
    fs.appendFileSync(output, `${clientNo},${duriation}\r\n`);
  }
};

(async () => {

  const client = new RemoteClient(options.endpoint, 'HostName=cloudDoorIot.azure-devices.net;DeviceId=MyNodeDevice;SharedAccessKey=HfOBUbhDlde71B5AXpCGVjANy6Dlk15/v5gRixoIpcM=');
  client.start();

  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    for (let clientId = 0; clientId < options.clients; clientId++) {
      console.log(`Sending command ${clientId}`);
      await retry(() => logTime(clientId, () => client.ping()));
    }
  } finally {
    client.stop();
  }

})();