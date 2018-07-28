'use strict';

const {ClientNotFoundError} = require('./errors');
const {timeout} = require('promise-timeout');
const uuidv4 = require('uuid/v4');
const ss = require('socket.io-stream');

const getClientSocket = (io, clientId) => {
  const result = io.sockets.clients().connected[clientId];
  if (!result) {
    throw new ClientNotFoundError(clientId);
  }
  return result;
};


class ClientManager {

  constructor(io) {
    this.io = io;
  }

  start() {
    this.io.on('connection', socket => {
      console.log('A bot connected');
      socket.on('register', data => {
        socket.clientData = data;
      });
    });
    return this;
  }

  async publishJsonRequest(clientId, res, request) {
    const clientSocket = getClientSocket(this.io, clientId);
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
  }

  async publishStreamingRequest(clientId, res, request) {
    const clientSocket = getClientSocket(this.io, clientId);
    request.txId = uuidv4();

    const streamSocket = ss(clientSocket);
    streamSocket.once(request.txId, (stream) => {
      stream.pipe(res);
    });
    clientSocket.emit('command', request);
  }
}

module.exports = {
  ClientManager
};