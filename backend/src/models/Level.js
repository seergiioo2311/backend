const { DataTypes } = require("sequelize");
const { sequelize_game, connectDB } = require("../config/db.js");

const Level = sequelize_game.define(
    "Level",
    {
        level_number: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        experience_required: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        }
    }, 
    {
        timestamps: true
    }
);

module.exports = Level;