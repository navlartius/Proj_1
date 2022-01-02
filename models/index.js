//"use strict" Directive
//It is not a statement, but a literal expression, ignored by earlier versions of JavaScript.
//The purpose of "use strict" is to indicate that the code should be executed in "strict mode". 
//With strict mode, you can not, for example, use undeclared variables.

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

console.log('The env is:' + env)
//what is this
const config = require(__dirname + '/../config/config.json')[env];
console.log(path.resolve(__dirname + '/../config/config.json'))

console.log('The config is:' + config)

const db = {};


let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
  console.log('one: connected')
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
  console.log('two: connected')
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
    console.log('model aquired: ' + model.name)
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
module.exports = sequelize;
