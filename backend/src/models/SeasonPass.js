const { DataTypes } = require("sequelize");
const { sequelize_loggin, connectDB, sequelize_game } = require("../config/db.js");

const SeasonPass = sequelize_game.define(
    "SeasonPass",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:  {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }, 
        start: {
            type: DataTypes.DATE,
            allowNull: false,
            unique: true
        },
        end: {
            type: DataTypes.DATE,
            allowNull: false,
            unique: true
        }, 
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = SeasonPass;