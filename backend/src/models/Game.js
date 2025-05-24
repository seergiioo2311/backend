const { DataTypes } = require("sequelize");
const { sequelize_game, connectDB } = require("../config/db.js");

const GAME_STATUS = {
    ACTIVE: "Active",
    PAUSED: "Paused",
    FINISH: "Finish"
};

const Game = sequelize_game.define (
    "Game",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            allowNull: true,
            autoIncrement: true
        },
        status: {
            type: DataTypes.ENUM(...Object.values(GAME_STATUS)),
            allowNull: false
        },
    }, 
    {
        timestamps: true
    }
);

module.exports = { Game, GAME_STATUS };
