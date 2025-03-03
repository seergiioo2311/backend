const { DataTypes } = require("sequelize");
const { sequelize_game, connectDB } = require("../config/db.js");

const Level = sequelize_game.define(
    "Level",
    {
        level_number: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        experience_requierd: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, 
    {
        timestamps: true
    }
);

module.exports = Level;