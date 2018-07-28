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
  async process(clientCommand, client) {
    const clientManager = client.clientManager;
    const parsedCommand = clientCommand.match(/([a-z]+)[ ]*(.*)/i);
    let details;
    switch (parsedCommand ? parsedCommand[1].toLowerCase() : '') {
      case 'list':
        await listAllClients(clientManager);
        break;
      case 'browse':
        details = parsedCommand[2].match(/([a-z0-9\-_]+) (.*)/i);
        if (!details || details.length !== 3) {
          console.error('Failed to parse the command. Provide it int the format "client browse <client ID> <path>"');
          return;
        }
        const result = await clientManager.browse(details[1].trim(), details[2].trim());
        console.log(JSON.stringify(result, null, '\t'));
        break;
      case 'upload':
        details = parsedCommand[2].match(/([a-z0-9\-_]+) (.*)/i);
        if (!details || details.length !== 3) {
          console.error('Failed to parse the command. Provide it int the format "client browse <client ID> <path>"');
          return;
        }
        await upload(clientManager, {clientId: details[0].trim(), path: details[1].trim()});
        break;
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