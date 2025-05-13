const { DataTypes } = require("sequelize");
const { sequelize_loggin, connectDB, sequelize_game } = require("../config/db.js");
const  { Game } = require("./Game.js");
const User  = require("./User.js");

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
        name : {
            type: DataTypes.STRING, //Nombre de la partida privada
            allowNull: false
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
        unique_code: { // Codigo el cual el usuario podrá compartir para obtener la partida privada
            type: DataTypes.STRING,
            allowNull: false
        },
        leader: { // Usuario que ha creado la partida privada
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        isFirstGame: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
    }, 
    {
        timestamps: true
    }
);

module.exports = Private;
