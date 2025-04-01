const Priv = require('../models/Private');
const { Op } = require('sequelize');
const axios = require('axios');
const { Json } = require('sequelize/lib/utils');

/**
 * @description Crea una partida privada nueva
 * @param {string} passwd - Contraseña de la partida privada
 * @param {number} maxPlayers - Número máximo de jugadores
 * @returns {Json} - Devuelve la partida privada creada
 * @throws {Error} - Maneja errores internos del servidor
 */
async function createPrivateGame(passwd, maxPlayers) {
    try{
        
        //Obtenemos el endpoint donde se ejecutará la partida
        const response = await axios.get('http://localhost:3000/api/privateGames'); //? Este endpoint está aun por definir ya que lo proporciona el equipo de game_server
        const link = response.data.gameEndpoint; 
        
        if(!link) {
            throw new Error('No se pudo obtener el endpoint de la partida privada');
        }

        const newPrivateGame = await Priv.create({
            passwd,
            link,
            maxPlayers,
            currentPlayers: 0
        });

        return newPrivateGame.link;
    }
    catch (error) {
        throw new Error(`Error creando partida privada: ${error.message}`);
    }
}

/**
 * @description Obtiene una partida privada por su id
 * @returns {Json} - Devuelve la partida privada y error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
async function getPrivateGames() {
    try {
        const privateGames = await Priv.findAll({
            attributes: ['id', 'maxPlayers', 'currentPlayers']
        });
        return privateGames;
    } catch (error) {
        throw new Error(`Error obteniendo partidas privadas: ${error.message}`);
    }
}

/**
 * 
 * @param {number} gameId - Id de la partida privada 
 * @param {string} passwd - Contraseña de la partida privada 
 * @returns {Json} - Devuelve la partida privada y error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
async function joinPrivateGame(gameId, passwd) {
    try {
        const privateGame = await Priv.findOne({
            where: {
                id: gameId,
                passwd: passwd
            }
        });

        if (!privateGame) {
            return null;
        }

        return privateGame.link;
    } catch (error) {
        throw new Error(`Error uniendo a la partida privada: ${error.message}`);
    }
}

/**
 * @description Elimina una partida privada
 * @param {number} gameId - Id de la partida privada 
 * @returns {Json} - Devuelve confirmacion o error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
async function deletePrivateGame(gameId) {
    try {
        const deletedGame = await Priv.destroy({
            where: {
                id: gameId
            }
        });

        if (!deletedGame) {
            return null;
        }

        return deletedGame;
    } catch (error) {
        throw new Error(`Error eliminando partida privada: ${error.message}`);
    }
}

/**
 * @description Obtiene el número de jugadores de una partida privada
 * @param {Number} gameId - Id de la partida privada 
 * @returns {Json} - Devuelve el numero de jugadores y error en caso de error
 */
async function getPlayers(gameId) {
    try {
        const privateGame = await Priv.findOne({
            where: {
                id: gameId
            }
        });

        if (!privateGame) {
            return null;
        }

        return privateGame.currentPlayers;
    } catch (error) {
        throw new Error(`Error obteniendo jugadores de la partida privada: ${error.message}`);
    }
}

module.exports = { createPrivateGame, getPrivateGames, joinPrivateGame, deletePrivateGame, getPlayers };
