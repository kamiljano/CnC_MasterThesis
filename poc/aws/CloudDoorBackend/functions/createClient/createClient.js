'use strict';

const clientService = require('./lib/clientService');

module.exports.handle = async event => {
  try {
    const client = await clientService.createClient();
    console.log(JSON.stringify({
      message: 'Successfully created a new client',
      clientId: client.id
    }));
    return {
      statusCode: 201,
      body: JSON.stringify(client)
    };
  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Unexpected error has occurred'
      })
    };
  }
};