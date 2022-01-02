module.exports = (sequelize, DataTypes) => {
    //module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        ID: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            validate: { notEmpty: true },
            primaryKey: false,
            unique: true,
            autoIncrement: true,

        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,

        },
        password: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER(3),
            allowNull: false,
        },
        isAdmin: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            unique:true,
            allowNull: false,
        },
        mobileno: { 
          type:DataTypes.INTEGER(12),
            allowNull: false,
        }
        },
        {
            freezeTableName: true
        })

    return User

}

