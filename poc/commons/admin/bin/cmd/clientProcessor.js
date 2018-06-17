'use strict';

const Table = require('cli-table');

const listAllClients = async clientManager => {
  const clients = await clientManager.listAll();
  if (!clients.length) {
    console.log('No clients available');
  } else {
    const table = new Table({
      head: ['ID', 'OS', 'OS Version'],
      colWidths: [40, 15, 20]
    });
    clients.forEach(client => {
      table.push([client.id, client.os.type, client.os.version]);
    });
    console.log(table.toString());
  }
};

module.exports = {
  process(clientCommand, client) {
    const clientManager = client.clientManager;
    const parsedCommand = clientCommand.match(/([a-z]+)[ ]*(.*)/);
    switch (parsedCommand ? parsedCommand[1] : '') {
      case 'list':
        return listAllClients(clientManager);
      case 'browse':
        const details = parsedCommand[2].match(/([a-z0-9\-]+) (.*)/);
        if (!details || details.length !== 3) {
          console.error('Failed to parse the command. Provide it int the format "client browse <client ID> <path>"');
          return;
        }
        return new Promise((resolve, reject) => {
          clientManager.onClientResponse = message => {
            message = JSON.parse(message);
            console.log(JSON.stringify(message.result, null, '\t'));
            if (message.success) {
              resolve(message.result);
            } else {
              reject(message.result);
            }
          };
          clientManager.browse(details[1], details[2]);
        });
      default:
        console.error('Invalid client command. The supported ones are: list, browse');
    }
  },

  get description() {
    return [
      {command: 'client list', description: 'Lists all clients that are currently online'},
      {command: 'client browse <clientId> <path>', description: 'Lists all files under the specified path. On windows the path "/" lists all drives'}
    ];
  }
};