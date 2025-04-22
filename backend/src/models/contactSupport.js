const { DataTypes } = require("sequelize");
const { sequelize_loggin, connectDB, sequelize_game } = require("../config/db.js");

const TYPE_ISSUE = {
    TECHNICAL_PROBLEM: "technical_problem",
    ACCOUNT_PROBLEM: "account_problem",
    BUG: "bug",
    PAYMENT_PROBLEM: "payment_problem",
    OTHER: "other"
};

const ContactSupport = sequelize_game.define(
    "ContactSupport", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name:  {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        resolved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        type: {
            type: DataTypes.ENUM(...Object.values(TYPE_ISSUE)),
            allowNull: false
        },
        reponse: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = ContactSupport;