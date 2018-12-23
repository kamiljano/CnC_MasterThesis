'use strict';

const Client = require('clouddoorclient');
const {ServerConnector} = require('./lib/connectors/serverConnector');
const commandLineArgs = require('command-line-args');
const path = require('path');
const fs = require('fs');

const options = commandLineArgs([
  {name: 'output', alias: 'o', type: String},
  {name: 'clients', type: Number, defaultValue: 10},
  {name: 'override', type: Boolean, defaultValue: false},
  {name: 'urlBase', type: String},
  {name: 'port', type: Number}
]);

if (!options.port || !options.urlBase) {
  console.error('The parameters "urlBase" and "port" are mandatory as the test is meant to run against a remote server rather than the locally spawned one');
  return;
}

const connector = new ServerConnector(options.urlBase);

class ConnectedClient {

  constructor(client, connector, clientData) {
    this._client = client;
    this._connector = connector;
    this._clientData = clientData;
  }

  listFiles() {
    return this._connector.listFiles(this._clientData.id, '/');
  }

  stop() {
    this._client.stop();
  }
}

const startClient = async expectedSize => {
  const allClients = await connector.listClients({});

  const result = new Client({urlBase: options.urlBase});
  result.start();

  const newAllClients = await connector.listClients({pollUntilNClientsAvailable: expectedSize});
  const clientData = newAllClients.filter(client => !allClients.includes(client))[0];

  return new ConnectedClient(result, connector, clientData);
};

const logTime = async (clientNo, runnable) => {
  const start = new Date().getTime();
  await runnable();
  const duriation = new Date().getTime() - start;
  if (options.output) {
    fs.appendFileSync(options.output, `${clientNo},${duriation}\r\n`);
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

  let client;
  try {
    const totalClients = options.clients || 10;
    client = await startClient(1);
    for (let i = 0; i < totalClients; i++) {
      await logTime(i + 1,() => client.listFiles());
    }
  } catch(err) {
    console.error(err);
  } finally {
    client.stop();
    process.exit(0);
  }
})();