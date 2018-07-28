'use strict';

const fs = require('fs');
const {WrongPathError} = require('./errors');

module.exports = request => {

  if (!fs.existsSync(request.path)) {
    throw new WrongPathError(request.path);
  }

  const stat = fs.statSync(request.path);
  if (!stat.isFile()) {
    throw new Error('You can only upload files');
  }

  return fs.createReadStream(request.path);
};