const { DataTypes } = require("sequelize");
const { sequelize_game } = require("../config/db.js");

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
            allowNull: false,
            defaultValue: 0
        },
        lastConnection: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    }, 
    {
        timestamps: true
    }
);

module.exports = User; // Export the User model


