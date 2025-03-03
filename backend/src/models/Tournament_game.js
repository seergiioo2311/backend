const { DataTypes } = require("sequelize");
const { sequelize_game } = require("../config/db.js");
const Tournament = require("./Tournament.js");
const Game = require("./Game.js");

const TournamentGame = sequelize_game.define(
    "TournamentGame",
    {
        id_tournament: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, 
            references: {
                model: Tournament,  
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        id_game: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,  
            references: {
                model: Game,  
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }
    },
    {
        timestamps: true 
    }
);

Tournament.belongsToMany(Game, {
    through: TournamentGame,
    as: "games",
    foreignKey: "id_tournament",
    otherKey: "id_game"
});

Game.belongsToMany(Tournament, {
    through: TournamentGame,
    as: "tournaments",
    foreignKey: "id_game",
    otherKey: "id_tournament"
});

module.exports = TournamentGame;
