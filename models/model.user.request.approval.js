module.exports = (sequelize, Sequelize) => {
    const requestApproval = sequelize.define("requestApproval", {
        requestID: {
            type: Sequelize.INTEGER(5),
            allowNull: false,
            validate: { notEmpty: true },
            primaryKey: true,
            autoIncrement: true,
        },
        requestDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        adminApproval: {
            type: Sequelize.INTEGER(1),
            allowNull: true,
            defaultValue: 0,
        },
        approvalDate: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        companyName: {
            type: Sequelize.STRING(250),
            allowNull: false,
        },
        companyBrief: {
            type: Sequelize.STRING(500),
            allowNull: false,
        },
        turnOver: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        salesVolume: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
       email: {
            type: Sequelize.STRING(50),
            //foreignKey: true,
            allowNull: false,
            unique: true,
            validate: {isEmail: true},
        },
        statusApproval:{
            type: Sequelize.STRING(50),
     
        }
           },
        {
            freezeTableName: true
        })

    return requestApproval

    }