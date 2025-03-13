const { DataTypes } = require("sequelize");
const { sequelize_loggin, connectDB, sequelize_game } = require("../config/db.js");
const Game = requiere("./Game.js");

const Private = sequelize_game.define(
    "Private", 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: Game,
                key: id
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        passwd: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, 
    {
        timestamps: true
    }
);

module.exports = Private;