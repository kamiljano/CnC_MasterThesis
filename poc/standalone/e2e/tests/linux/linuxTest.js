'use strict';

const {Server} = require('clouddoorserver');
const Client = require('clouddoorclient');
const chai = require('chai');
const {ServerConnector} = require('../../lib/connectors/serverConnector');
chai.should();

describe('GIVEN a server and a client running on Linux', () => {

  const serverUrl = 'http://localhost:3000';
  let server;
  let client;
  let connector;

  before(async () => {
    server = new Server({port: 3000});
    await server.start();
    client = new Client({urlBase: serverUrl});
    await client.start();
    connector = new ServerConnector(serverUrl);
  });

  after(() => {
    server.stop();
    client.stop();
  });

  it('WHEN requesting from the server a list of clients, THEN a list is successfully returned and specifies a linux client', async () => {
    const clients = await connector.listClients({pollUntilNClientsAvailable: 1});
    clients.length.should.equal(1);
    clients[0].os.type.should.equal('linux');
  });

  it('WHEN requesting from the server a list of files under "/", THEN a list of directories is returned', async () => {
    const clients = await connector.listClients({pollUntilNClientsAvailable: 1});
    const drives = await connector.listFiles(clients[0].id, '/');
    drives.should.deep.contain({
      path: 'home',
      type: 'dir'
    });
  });

});