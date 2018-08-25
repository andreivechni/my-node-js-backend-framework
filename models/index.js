const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env]; // eslint-disable-line import/no-dynamic-require
const db = {};
let model;

function loadModel(dir) {
  const sequelize = (config.use_env_variable) ?
    new Sequelize(process.env[config.use_env_variable], config, {
      'define': {
        'charset': 'utf8',
        'collate': 'utf8_general_ci',
        'timestamps': true,
      },
    }) :
    new Sequelize(config.database, config.username, config.password, config, {
      'define': {
        'charset': 'utf8',
        'collate': 'utf8_general_ci',
        'timestamps': true,
      },
    });
  fs
    .readdirSync(dir)
    .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
      model = sequelize.import(path.resolve(dir, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  sequelize.sync();

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
}

exports.loadModel = loadModel;
exports.getDB = () => db;
