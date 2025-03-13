const { DataTypes } = require("sequelize");
const { sequelize_loggin, connectDB, sequelize_game } = require("../config/db.js");
const Game = requiere("./Game.js");

const Public = sequelize_game.define(
    "Public", 
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
        game_time: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, 
    {
        timestamps: true
    }
);

module.exports = Public;