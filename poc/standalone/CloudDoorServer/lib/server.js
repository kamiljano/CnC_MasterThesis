'use strict';

const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const uuidv4 = require('uuid/v4');
const {timeout} = require('promise-timeout');

const publishRequest = async (io, clientId, res, request) => {
  const clientSocket = io.sockets.clients().connected[clientId];
  if (!clientSocket) {
    return res.status(404).send({
      error: `No client with id ${clientId} is currently connected`
    })
  }
  request.txId = uuidv4();
  try {
    const response = await timeout(new Promise(resolve => {
      clientSocket.once(request.txId, resolve);
      clientSocket.emit('command', request);
    }), 30000);
    res.send(response);
  } catch (err) {
    console.warn('Failed to send the command');
    res.status(500).send(err);
  } finally {
    clientSocket.removeAllListeners(request.txId);
  }
};

module.exports.Server = class {

  constructor({port = 8080}) {
    this.port = port;
  }

  start() {
    const app = express();
    const server = http.Server(app);
    const io = socketio(server);
    io.on('connection', socket => {
      console.log('A bot connected');
      socket.on('register', data => {
        socket.clientData = data;
      });
    });

    app.get('/clients', (req, res) => {
      const clients = io.sockets.clients();
      const result = [];
      for (const connectedId in clients.connected) {
        result.push({
          id: connectedId,
          os: clients.connected[connectedId].clientData.os
        });
      }
      res.send(result);
    });

    app.get('/clients/:clientId/files', (req, res) => {
      if (!req.query.path) {
        return res.status(400).send({
          error: 'Path query parameter is mandatory'
        });
      }
      publishRequest(io, req.params.clientId, res, {
        operation: 'browse',

        details: {
          path: req.query.path
        }
      });
    });

    server.listen(this.port, () => {
      console.info(`Listening on localhost:${this.port}`);
    });
  }
};