'use strict';

const request = require('request-promise-native');
const {Server} = require('CloudDoorServer/lib/server');
const Client = require('CloudDoorClient/client');
const {retry} = require('e2e');
const fs = require('fs');
const chai = require('chai');
chai.should();

describe('GIVEN a server and a client running on Windows', () => {

  const serverUrl = 'http://localhost:667';
  let server;
  let client;

  before(async () => {
    server = new Server({port: 667});
    await server.start();
    client = new Client({urlBase: serverUrl});
    await client.start();
  });

  after(() => {
    server.stop()
    client.stop();
  });

  const listClients = () => {
    return retry(async () => {
      const clients = await request.get(`${serverUrl}/clients`, {json: true});
      if (clients.length) {
        return clients;
      }
      throw new Error('No clients registered');
    });
  };

  const listFiles = (clientId, path) => {
    return request.get(`${serverUrl}/clients/${clientId}/files`, {
      json: true,
      qs: {
        path
      },
      headers: {
        'content-type': 'application/json'
      }
    });
  };

  const downloadFile = (clientId, path) => {
    return request.get(`${serverUrl}/clients/${clientId}/files`, {
      json: true,
      qs: {
        path
      }
    });
  };

  it('WHEN requesting from the server a list of clients, THEN a list is successfully returned', async () => {
    const clients = await listClients();
    clients.length.should.equal(1);
    clients[0].id.should.not.be.undefined;
    clients[0].os.type.should.equal('windows');
    clients[0].os.version.should.not.be.undefined;
  });

  it('WHEN requesting from the server a list of files under "/", THEN a list of drives is returned', async () => {
    const clients = await listClients();
    const drives = await listFiles(clients[0].id, '/');
    drives.should.deep.contain({
      path: 'C:',
      type: 'dir'
    });
  });

  it('WHEN requesting from the server a list of files under a subdirectory, THEN a list of files under that directory is returned', async () => {
    const clients = await listClients();
    const drives = await listFiles(clients[0].id, '/');
    const files = await listFiles(clients[0].id, drives[0].path);
    files.should.not.equal(drives);
  });

  it('WHEN requesting from the server a file, THEN the file content is returned', async () => {
    const clients = await listClients();
    const fileContent = await downloadFile(clients[0].id, __filename);
    const testFileContent = fs.readFileSync(__filename, 'utf8');
    fileContent.should.equal(testFileContent);
  });

});