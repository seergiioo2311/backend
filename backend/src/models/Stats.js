const { DataTypes } = require("sequelize");
const { sequelize_game } = require("../config/db.js");
const User = require("./User.js");
const Game = require("./Game.js");

const Stats = sequelize_game.define(
    "Stats",
    {
        id_user: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            references: {
                model: User, 
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        id_game: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: Game,  
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        time_played: {
            type: DataTypes.TIME,
            allowNull: false
        },
        match_date: {
            type: DataTypes.DATE,
            allowNull: false
        }, 
        num_kills: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: true 
    }
);

User.belongsToMany(Game, {
    through: Stats,
    as: "gameStats",
    foreignKey: "id_user",
    otherKey: "id_game"
});

Game.belongsToMany(User, {
    through: Stats,
    as: "playerStats",
    foreignKey: "id_game",
    otherKey: "id_user"
});

module.exports = Stats;
