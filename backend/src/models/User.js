const { DataTypes } = require("sequelize");
const { sequelize_game, connectDB } = require("../config/db.js");

const User = sequelize_game.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        experience: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, 
    {
        timestamps: true
    }
);

module.exports = User;
