const confPath = process.env.testPrivsPath || '../config/privilages';
const privilages = require(confPath);

module.exports = class User {
  constructor(id, username, token, role) {
    this.id = id;
    this.username = username;
    this.token = token;
    this.role = role;
  }

  hasPriv(model, method) {
    if (privilages[this.role][model]) {
      return Object.prototype.hasOwnProperty.call(privilages[this.role][model], method);
    }
    return new Error(`${model} model does not exist!`);
  }

  getLims(model, method) {
    if (privilages[this.role][model]) {
      return privilages[this.role][model][method];
    }
    return new Error(`${model} model does not exist!`);
  }
};
