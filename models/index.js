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


//let sequelize;
/* if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
  console.log('one: connected')
} else { */
  
  const sequelize = new Sequelize(config.database, config.username, config.password, config);
  //console.log('two: connected')
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

sequelize.authenticate()
  .then(() => {
      console.log('Connection has been established successfully.');
  })
  .catch(err => {
      console.error('Unable to connect to the database:', err);

  });


//}

/* fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    //const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
    console.log('model aquired: ' + model.name)
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  } */
  
  
  fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    }).forEach(file => {
      console.log(file);
        //const model = sequelize["import"](path.join(__dirname, file));
       // const model = sequelize.import(path.join(__dirname, file));
        //const model = sequelize.import(path.join(__dirname, file));
        const model = require(path.join(__dirname, file))(sequelize, Sequelize);
        console.log(model);
        db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


db.User.hasOne(db.requestApproval, {foreignKey: 'userID', allowNull:false})
db.requestApproval.belongsTo(db.User, {foreignKey: 'userID', allowNull:false})

db.User.hasMany(db.Product)
db.Product.belongsTo(db.User)

//db.Product.hasOne(db.User)

//console.log('The db object: ' , db)


// ----------------scope -----------------//

db.requestApproval.addScope('viewApprovedRequest', {
 // attribute: ['requestID','requestDate', 'approvalDate','statusApproval', 'userID'],
  where:{adminApproval:1}
})

db.User.addScope('viewUserProduct', {
  // attribute: ['requestID','requestDate', 'approvalDate','statusApproval', 'userID'],
   include: {model: db.Product,
    attributes:['prodDesc','prodName','prodUnitCost']}
   
  })

  db.User.addScope('userAttribute', {
    attributes:['firstName','lastName','email']

  })

  db.Product.addScope('productAttribute',{
    attributes:['prodDesc','prodName','prodUnitCost']
  })

module.exports = db;

//module.exports = sequelize;
