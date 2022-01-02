const express = require('express')
const app = express()
const Sequelize = require('sequelize');
const sequelize = require('./models/index')

var logger = require('morgan');
const db = require('./models')

/* const {User} = require('./models/model.user')
const {product} = require('./models/model.product')
const {userRequest} = require('./models/model.user.request.approval') */
db.User = require('./models/model.user')(sequelize,Sequelize);

db.userRequest = require('./models/model.user.request.approval')(sequelize,Sequelize);
db.prod = require('./models/model.product')(sequelize,Sequelize);

const userRoute = require('./Routes/Routes.user')
const adminRoute = require('./Routes/Routes.admin')



app.use(express.json())
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }))

app.use('/user',userRoute)
app.use('/admin',adminRoute)

//sequelize.sync()
//sequelize.sync({force: true})

db.User.hasOne(db.userRequest)
db.userRequest.belongsTo(db.User)

db.User.hasMany(db.prod)
db.prod.belongsTo(db.User)
//db.product.hasOne(db.user)

sequelize.sync()
//sequelize.sync({force: true})

app.listen(5000, (req,res)=>{
   console.log('Server is listening at port 5000')
})