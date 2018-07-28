'use strict';

class WrongPathError extends Error {
  constructor(path) {
    super(`The path ${path} does not exist`);
  }
}

module.exports = {
  WrongPathError
};