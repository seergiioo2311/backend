const { DataTypes } = require("sequelize");
const { sequelize_game } = require("../config/db.js");
const User = require("./User.js");
const Game = require("./Game.js");

const PLAYER_STATUS = {
    ALIVE: "Alive",
    ELIMINATED: "Eliminated",
    WAITING: "Waiting", 
    READY: "Ready"
};

const Playing = sequelize_game.define(
    "Playing",
    {
        id_user: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,  
            references: {
                model: User, 
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
        },
        status: {
            type: DataTypes.ENUM(...Object.values(PLAYER_STATUS)),
            allowNull: false
        },
        n_divisions: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        x_position: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        y_position: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, 
    {
        timestamps: true
    }
);

User.belongsToMany(Game, {
    through: Playing,
    as: "games",
    foreignKey: "id_user",
    otherKey: "id_game"
});

Game.belongsToMany(User, {
    through: Playing,
    as: "players",
    foreignKey: "id_game",
    otherKey: "id_user"
});

module.exports = { Playing, PLAYER_STATUS };
