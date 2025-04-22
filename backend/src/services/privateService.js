const Priv = require('../models/Private');
const { Game, GAME_STATUS } = require('../models/Game');
const { Op } = require('sequelize');
const axios = require('axios');
const { Json } = require('sequelize/lib/utils');
const { v4: uuidv4 } = require('uuid'); 


/**
 * @description Crea una partida privada nueva
 * @param {string} passwd - Contraseña de la partida privada
 * @param {number} maxPlayers - Número máximo de jugadores
 * @returns {Json} - Devuelve la partida privada creada
 * @throws {Error} - Maneja errores internos del servidor
 */
async function createPrivateGame(passwd, maxPlayers) {
    try{
        //Esta funcion está aun por implementar correctamente, el esqueleto basico es correcto, pero necesitaremos saber los endpoints reales para así, tener esto funcionando correctamente
        //Obtenemos el endpoint donde se ejecutará la partida
        //const response = await axios.get('http://localhost:3000/api/privateGames'); //? Este endpoint está aun por definir ya que lo proporciona el equipo de game_server
        //const link1 = response.data.gameEndpoint; //el nombre de esta variable tambien esta por definir, ya que depende de la respuesta del equipo de game_server
        // TODO: HAY QUE ELIMINAR ESTA LINEA, ESTO ES SOLO PARA TESTING
        const link = 'http://localhost:9091'; // FIXME: Este endpoint está aun por definir ya que lo proporciona el equipo de game_server, el actual esta proporcionado por el equipo
        const gameId = uuidv4(); //Generamos un id único para la partida privada
        
        if(!link) {
            throw new Error('No se pudo obtener el endpoint de la partida privada');
        }


        const newGame = await Game.create({
            status: GAME_STATUS.ACTIVE,
        });

        const newPrivateGame = await Priv.create({
            id: newGame.id,
            unique_code: gameId,
            passwd,
            link,
            maxPlayers,
            currentPlayers: 0
        });

        return { link: newPrivateGame.link, id: newPrivateGame.unique_code };
    }
    catch (error) {
        console.error(error);
        throw new Error(`Error creando partida privada: ${error.message}`);
    }
}

/**
 * @description Obtiene todas las partidas privadas
 * @returns {Json} - Devuelve la partida privada y error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
async function getPrivateGames() {
    try {
        const privateGames = await Priv.findAll({
            attributes: ['id', 'unique_id', 'maxPlayers', 'currentPlayers']
        });
        return { "privateGames": privateGames };
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

        return { link: privateGame.link };
    } catch (error) {
        throw new Error(`Error uniendo a la partida privada: ${error.message}`);
    }
}

/**
 * @description Obtiene una partida privada por su id 
 * @param {string} unique_id - Id de la partida privada 
 * @returns {Json} - Devuelve la partida privada y error en caso de error 
 * @throws {Error} - Maneja errores internos del servidor
 */ 
async function getPrivateGameWithId(unique_id) {
    try { 

        if(!unique_id) {
            throw new Error("El id de la partida privada no puede ser nulo");
        }
        
        const privateGame = await Priv.findOne({
            where: {
                unique_code: unique_id
            }
        });
        
        return {privateGame: privateGame};

    } catch(error){
        throw new Error("Error obteniendo la partida privada: " + error.message);
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
        
        console.log(deletedGame);

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



module.exports = { createPrivateGame, getPrivateGames, joinPrivateGame, deletePrivateGame, getPlayers, getPrivateGameWithId };
