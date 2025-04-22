const { DataTypes } = require("sequelize");
const { sequelize_loggin, connectDB, sequelize_game } = require("../config/db.js");
const  { Game } = require("./Game.js");

const Private = sequelize_game.define(
    "Private", 
    {
        id: {
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
        passwd: {
            type: DataTypes.STRING,
            allowNull: false
        },
        link: {
            type: DataTypes.STRING, //Enlace al endpoint de esta partida privada
            allowNull: true
        },
        maxPlayers: {
            type: DataTypes.INTEGER, //Número máximo de jugadores
            allowNull: false
        },
        currentPlayers: {
            type: DataTypes.INTEGER, //Número de jugadores actuales
            allowNull: false
        },
    }, 
    {
        timestamps: true
    }
);

module.exports = Private;
