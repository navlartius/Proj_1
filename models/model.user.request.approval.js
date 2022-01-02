module.exports = (sequelize, DataTypes) => {
    const requestApproval = sequelize.define("requestApproval", {
        requestID: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            validate: { notEmpty: true },
            primaryKey: true,
            autoIncrement: true,
        },
        requestDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        adminApproval: {
            type: DataTypes.INTEGER(1),
            allowNull: true,
            defaultValue: 0,
        },
        approvalDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        companyName: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        companyBrief: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        turnOver: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        salesVolume: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            //foreignKey: true,
            allowNull: false,
        }
           },
        {
            freezeTableName: true
        })

    return requestApproval

    }