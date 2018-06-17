'use strict';

class ValidationError {
  constructor(responseCode, message) {
    this.responseCode = responseCode;
    this.message = message;
  }
}

class UnsupportedMethodError extends ValidationError {
  constructor(usedMethod) {
    super(405, `The method ${usedMethod} is not supported`);
  }
}

class InvalidPropertyError extends ValidationError {
  constructor(message) {
    super(400, message);
  }
}

const invalidCpu = cpu => !cpu.model || typeof cpu.model !== 'string' || !cpu.speed || typeof cpu.speed !== 'number';

module.exports.validate = req => {
  if (req.method !== 'POST') {
    throw new UnsupportedMethodError(req.method);
  }
  if (!req.body.os) {
    throw new InvalidPropertyError('The os (Operating System) property is mandatory');
  }
  if(!req.body.os.type || typeof req.body.os.type !== 'string') {
    throw new InvalidPropertyError('The os.type property is mandatory');
  }
  if(!req.body.os.version || typeof req.body.os.version !== 'string') {
    throw new InvalidPropertyError('The os.version property is mandatory')
  }
  if (!req.body.cpus) {
    throw new InvalidPropertyError('The cpus property is mandatory');
  }
  if (req.body.cpus.some(invalidCpu)) {
    throw new InvalidPropertyError('The cpus need to specify the model and the speed');
  }
  if (!req.body.totalMemory || typeof req.body.totalMemory !== 'number') {
    throw new InvalidPropertyError('The "totalMemory" property is mandatory');
  }
  if (typeof req.body.uuid !== 'undefined' && typeof req.body.uuid !== 'string') {
    throw new InvalidPropertyError('The property uuid is not mandatory, but once provided, has to be of type "string"');
  }
};

module.exports.ValidationError = ValidationError;