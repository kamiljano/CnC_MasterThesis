'use strict';

const {RequestError} = require('./errors');

module.exports = (err, req, res, next) => {
  if (!err) {
    next();
  }

  if (err instanceof RequestError) {
    res.status(err.code).send({
      error: err.message
    });
  } else {
    console.error(err);
    res.status(500).send({
      error: 'An unexpected error has occurred'
    });
  }
};