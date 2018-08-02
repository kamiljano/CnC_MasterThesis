'use strict';

const {ClientNotFoundError} = require('./errors');
const {timeout} = require('promise-timeout');
const uuidv4 = require('uuid/v4');
const ss = require('socket.io-stream');
const Crypt = require('g-crypt');

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
      const crypter = Crypt(socket.id);
      socket.on('register', data => {
        socket.clientData = crypter.decrypt(data);
      });
    });
    return this;
  }

  async publishJsonRequest(clientId, res, request) {
    const clientSocket = getClientSocket(this.io, clientId);
    const crypter = Crypt(clientId);
    request.txId = uuidv4();
    try {
      const response = await timeout(new Promise(resolve => {
        clientSocket.once(request.txId, resolve);
        clientSocket.emit('command', crypter.encrypt(request));
      }), 30000);
      res.send(crypter.decrypt(response));
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
    const crypter = Crypt(clientId);
    const streamSocket = ss(clientSocket);
    streamSocket.once(request.txId, stream => {
      stream.pipe(res);
    });
    clientSocket.emit('command', crypter.encrypt(request));
  }
}

module.exports = {
  ClientManager
};