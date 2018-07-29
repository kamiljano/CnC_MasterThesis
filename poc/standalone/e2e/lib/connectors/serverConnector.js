'use strict';

const request = require('request-promise-native');
const {retry} = require('e2e');

class ServerConnector {

  constructor(serverUrl) {
    this.serverUrl = serverUrl;
  }

  listClients({pollUntilNClientsAvailable}) {
    if (pollUntilNClientsAvailable) {
      return retry(async () => {
        const clients = await request.get(`${this.serverUrl}/clients`, {json: true});
        if (clients.length) {
          return clients;
        }
        throw new Error('No clients registered');
      });
    }
    return request.get(`${this.serverUrl}/clients`, {json: true});
  }

  listFiles(clientId, path) {
    return request.get(`${this.serverUrl}/clients/${clientId}/files`, {
      json: true,
      qs: {
        path
      },
      headers: {
        'content-type': 'application/json'
      }
    });
  }

  downloadFile(clientId, path) {
    return request.get(`${this.serverUrl}/clients/${clientId}/files`, {
      json: true,
      qs: {
        path
      }
    });
  }
}

module.exports = {ServerConnector};