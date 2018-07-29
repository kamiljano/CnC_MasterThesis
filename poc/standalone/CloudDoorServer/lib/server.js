'use strict';

const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const {MissingQueryParameter} = require('./errors');
const errorMiddleware = require('./errorMiddleware');
const {ClientManager} = require('./clientManager');

const asyncEndpoint = callback => {
  return async (req, res, next) => {
    try {
      await callback(req, res);
    } catch(err) {
      next(err);
    }
  };
};

module.exports.Server = class {

  constructor({port = 666}) {
    this.port = port;
  }

  start() {
    return new Promise(resolve => {
      const app = express();
      const server = http.Server(app);
      const io = socketio(server);
      this.clientManager = new ClientManager(io).start();

      app.get('/health', (req, res) => {
        res.status(200).send({server: true});
      });

      app.get('/clients', (req, res) => {
        const clients = io.sockets.clients();
        const result = [];
        for (const connectedId in clients.connected) {
          if (clients.connected[connectedId].clientData) {
            result.push({
              id: connectedId,
              os: clients.connected[connectedId].clientData.os
            });
          }
        }
        res.send(result);
      });

      app.get('/clients/:clientId/files', asyncEndpoint(async (req, res) => {
        if (!req.query.path) {
          throw new MissingQueryParameter('path');
        }
        if (req.headers['content-type'] === 'application/json') {
          await this.clientManager.publishJsonRequest(req.params.clientId, res, {
            operation: 'browse',

            details: {
              path: req.query.path
            }
          });
        } else {
          await this.clientManager.publishStreamingRequest(req.params.clientId, res, {
            operation: 'upload',

            details: {
              path: req.query.path
            }
          });
        }
      }));

      app.use(errorMiddleware);

      this._server = server.listen(this.port, () => {
        console.info(`Listening on localhost:${this.port}`);
        resolve();
      });
    });
  }

  stop() {
    this._server.close();
  }
};