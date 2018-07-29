'use strict';

const Client = require('CloudDoorClient/client');
const {startServer} = require('./lib/performance/serverProcess');
const {ServerConnector} = require('./lib/connectors/serverConnector');

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

(async () => {
  let serverProcess;
  const clients = [];
  try {
    serverProcess = await startServer(port);
    console.log(`No client usage: ${JSON.stringify(await serverProcess.resources())}`);
    for (let i = 0; i < 10; i++) {
      clients.push(await startClient(i + 1));
      console.log(`${i + 1}: ${JSON.stringify(await serverProcess.resources())}`);
    }
  } finally {
    clients.forEach(client => client.stop());
    if (serverProcess) {
      await serverProcess.kill();
    }
    process.exit(0);
  }
})();