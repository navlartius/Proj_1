//module.exports = (sequelize, DataTypes) => {
    module.exports = (sequelize, Sequelize) => {
    const prod = sequelize.define("Product", {
        productID: {
            type: Sequelize.INTEGER(5),
            allowNull: false,
            validate: { notEmpty: true },
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        prodName: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        prodDesc: {
            type: Sequelize.STRING(250),
            allowNull: false,
        },
        prodImage: {
            type: Sequelize.STRING(200),
            allowNull: true,
        },
        prodUnitCost: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING(50),
            //foreignKey: true,
            allowNull: false,
        }
    },
        {
            freezeTableName: true
        })

    return prod
}

