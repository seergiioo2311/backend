const { DataTypes } = require("sequelize");
const { sequelize_loggin, connectDB, sequelize_game } = require("../config/db.js");

const ACHIEVEMENT_TYPE = {
    TIMEPLAYED: "timePlayed", // Time played in seconds
    ELIMINATEDPLAYERS: "playersEliminated",
    MAXSCORE: "maxScore",
};

const Achievement = sequelize_game.define(
    "Achievement",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM(...Object.values(ACHIEVEMENT_TYPE)),
            allowNull: false
        },
        experience_otorgued: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        objective_value: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, 
    {
        timestamps: true
    }
);

module.exports = { Achievement, ACHIEVEMENT_TYPE };
