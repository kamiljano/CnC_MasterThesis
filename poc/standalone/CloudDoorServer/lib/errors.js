'use strict';

class RequestError extends Error {

  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

class ClientNotFoundError extends RequestError {
  constructor(clientId) {
    super(404, `No client with id ${clientId} is currently connected`);
  }
}

class MissingQueryParameter extends RequestError {
  constructor(queryParamName) {
    super(400, `The query parameter ${queryParamName} is mandatory`);
  }
}

module.exports = {
  RequestError,
  MissingQueryParameter,
  ClientNotFoundError
};