const { DataTypes } = require("sequelize");
const { sequelize_game, connectDB } = require("../config/db.js");

const TOURNAMENT_STATUS = {
    PENDING: "Pending",
    ACTIVE: "Active",
    FINISH: "Finish"
};

const Tournament = sequelize_game.define(
    "Tournament", 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false
        }, 
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM(...Object.values(TOURNAMENT_STATUS)),
            allowNull: false
        }
    }, 
    {
        timestamps: true
    }
);

module.exports = { Tournament, TOURNAMENT_STATUS };