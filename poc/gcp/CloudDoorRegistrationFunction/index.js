'use strict';

const requestValidator = require('./bin/validation/requestValidator');
const clientService = require('./bin/services/clientService');

const errorToString = err => {
  if (!err) {
    return 'null';
  }
  if (typeof err === 'string') {
    return err;
  }
  if (err.stack) {
    return err.stack;
  }
  if (typeof err === 'object') {
    return JSON.stringify(err);
  }
  return 'unknown';
};

const handleRequestValidationError = (err, res) => {
  console.error(errorToString(err));
  if (err instanceof requestValidator.ValidationError) {
    res.status(err.responseCode).send({
      message: err.message
    });
  } else {
    res.status(500).send({
      message: 'An unexpected error has occurred'
    });
  }
};

exports.handle = (req, res) => {
  try {
    requestValidator.validate(req);
  } catch (err) {
    handleRequestValidationError(err, res);
    res.end();
    return;
  }

  clientService.registerClient(req.body)
    .then(clientData => {
      res.status(200).send(clientData);
      res.end();
    })
    .catch(err => {
      handleRequestValidationError(err, res);
      res.end();
    });
};