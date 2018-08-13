'use strict';

const Client = require('clouddoorclient');
const {startServer} = require('./lib/performance/serverProcess');
const {ServerConnector} = require('./lib/connectors/serverConnector');
const commandLineArgs = require('command-line-args');
const path = require('path');
const fs = require('fs');

const options = commandLineArgs([
  {name: 'redis.host', type: String},
  {name: 'redis.port', type: Number},
  {name: 'output', alias: 'o', type: String},
  {name: 'clients', type: Number, defaultOption: 10},
  {name: 'override', type: Boolean, defaultOption: false}
]);

const port = 668;
const urlBase = `http://localhost:${port}`;
const connector = new ServerConnector(urlBase);

const startClient = async expectedSize => {
  const allClients = await connector.listClients({});

  const result = new Client({urlBase});
  result.start();

  const newAllClients = await connector.listClients({pollUntilNClientsAvailable: expectedSize});
  const clientData = newAllClients.filter(client => !allClients.includes(client))[0];
  await Promise.all([
    connector.listFiles(clientData.id, 'C:'),
    connector.downloadFile(clientData.id, __filename)
  ]);

  return result;
};

const getRedisOptions = () => {
  return options['redis.host'] && options['redis.port']
    ? {
      host: options['redis.host'],
      port: options['redis.port']
    }
    : undefined;
};

const logResourceUsage = (clientNo, resources) => {
  console.log(`Clienst: ${clientNo}: ${JSON.stringify(resources)}`);
  if (options.output) {
    const arr = [];
    for(const key in resources) {
      arr.push(resources[key]);
    }
    fs.appendFileSync(options.output, `${clientNo},${arr.join(',')}\r\n`);
  }
};

const validateOutputPath = () => {
  if (!options.output) {
    return;
  }
  if (fs.existsSync(options.output) && !options.override) {
    throw new Error(`The file ${options.output} already exists`);
  }
  if (!fs.existsSync(path.dirname(options.output))) {
    throw new Error(`The directory ${path.dirname(options.output)} does not exist`);
  }
};

(async () => {

  validateOutputPath();

  let serverProcess;
  const clients = [];
  try {
    serverProcess = await startServer(port, getRedisOptions());
    logResourceUsage(0, await serverProcess.resources());
    const totalCleints = options.clients || 10;
    for (let i = 0; i < totalCleints; i++) {
      clients.push(await startClient(i + 1));
      logResourceUsage(i + 1, await serverProcess.resources());
    }
  } finally {
    clients.forEach(client => client.stop());
    if (serverProcess) {
      await serverProcess.kill();
    }
    process.exit(0);
  }
})();