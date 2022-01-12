//module.exports = (sequelize, DataTypes) => {
    module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        userID: {
            type: Sequelize.INTEGER(5),
            allowNull: false,
            validate: { notEmpty: true },
            primaryKey: true,
            unique: true,
            autoIncrement: true,
        },
        firstName: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        lastName: {
            type: Sequelize.STRING(50),
            allowNull: false,

        },
        password: {
            type: Sequelize.STRING(250),
            allowNull: false,
        },
        age: {
            type: Sequelize.INTEGER(3),
            allowNull: false,
            validate: {min: 15}

        },
        isAdmin: {
            type: Sequelize.INTEGER(1),
            allowNull: false,
            defaultValue: 0,
        },
        gender: {
            type: Sequelize.STRING(1),
            allowNull: false,
            validate: {isIn:[['M','F','T']],

            }
        },
        dob: {
            type: Sequelize.DATE,
            allowNull: false,
            validate: {isDate: true },
        },
        email: {
            type: Sequelize.STRING(50),
            unique:true,
            allowNull: false,
            validate: {isEmail: true}
        },
        mobileno: { 
          type:Sequelize.INTEGER(12),
            allowNull: false,

        }
        },
        {
            freezeTableName: true
        })

    return User

}

