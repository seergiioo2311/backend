const Priv = require('../models/Private');
const { Playing, PLAYER_STATUS } = require('../models/Playing');
const { Game, GAME_STATUS } = require('../models/Game');
const { Op } = require('sequelize');
const axios = require('axios');
const { Json } = require('sequelize/lib/utils');
const { sequelize_game } = require('../config/db');
const { v4: uuidv4 } = require('uuid'); 


/**
 * @description Crea una partida privada nueva
 * @param {string} passwd - Contraseña de la partida privada
 * @param {number} maxPlayers - Número máximo de jugadores
 * @returns {Json} - Devuelve la partida privada creada
 * @throws {Error} - Maneja errores internos del servidor
 */
async function createPrivateGame(name, passwd, maxPlayers) {
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
            name,
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
            attributes: ['id', 'name', 'maxPlayers', 'currentPlayers']
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

/**
 * @description Marca a un jugador como listo en una partida privada
 * @param {Number} gameId - Id de la partida privada
 * @param {Number} userId - Id del jugador
 * @returns {Json} - Devuelve null si se ha marcado como listo correctamente, -1 si no se ha encontrado la partida privada
 */
async function isReady(gameId, userId) {
    try {
        const privateGame = await Priv.findOne({
            where: {
                id: gameId,
                userId: userId
            }
        });

        if (!privateGame) {
            return -1;
        }

        const playing = await Playing.findOne({
            where: {
                id_game: gameId,
                id_user: userId
            }
        });

        playing.status = PLAYER_STATUS.READY;
        await playing.save();

        return null;
    } catch (error) {
        throw new Error(`Error obteniendo jugadores de la partida privada: ${error.message}`);
    }
}

/**
 * @description Obtiene todos los jugadores de una partida privada
 * @param {Number} gameId - Id de la partida privada
 * @returns {Json} - Devuelve los jugadores de la partida privada y error en caso de error
 */
async function getAllPlayers(gameId) {
    try {
        const players = await Playing.findAll({
            where: {
                id_game: gameId
            }
        });

        return { userId: players.id_user, status: players.status, n_divisions: players.n_divisions, x_pos: players.x_position, y_pos: players.y_position, score: players.score };
    } catch (error) {
        throw new Error(`Error obteniendo jugadores de la partida privada: ${error.message}`);
    }
}

/**
 * @description Obtiene el link de una partida privada
 * @param {Number} gameId - Id de la partida privada
 * @returns {Json} - Devuelve el link de la partida privada y error en caso de error
 */
async function getLink(gameId) {
    try {
        const privateGame = await Priv.findOne({
            where: {
                id: gameId
            }
        });

        if (!privateGame) {
            throw new Error('Partida privada no encontrada');
        }

        if (privateGame.link === null) {
            throw new Error('Link no disponible');
        }

        const res = await Playing.count({
            where: {
                id_game: gameId,
                status: {
                    [Op.eq]: PLAYER_STATUS.READY
                }
            }
        });

        if (res >= privateGame.get('maxPlayers')) {
            throw new Error('No se puede obtener el link, hay jugadores pendientes de dar listo');
        }

        return privateGame.link;
    } catch (error) {
        throw new Error(`Error obteniendo el link de la partida privada: ${error.message}`);
    }
}

/**
 * @description Actualiza los valores de un determinado jugador para una determinada partida
 * @param {Number} gameId - Id de la partida privada
 * @param {Number} userId - Id del usuario
 * @param {Number} status - Nuevo estado del usuario
 * @param {Number} n_divisions - Nuevo número de divisiones del usuario
 * @param {Number} x_pos - Nueva posición en el eje X del usuario
 * @param {Number} y_pos - Nueva posición en el eje Y del usuario
 * @param {Number} score - Nueva puntuación del usuario
 * @returns - Devuelve null, en el caso de que se haya actualizado correctamente, o -1, en el caso de que no haya encontrado al usuario, o lanza un error en caso de error
 */
async function uploadValues(gameId, userId, status, n_divisions, x_pos, y_pos, score) {
    try {
        const player = await Playing.findOne({
            where: {
                id_game: gameId,
                id_user: userId
            }
        });

        if (!player) {
            throw new Error('No se ha encontrado al usuario');
        }

        player.status = status;
        player.n_divisions = n_divisions;
        player.x_position = x_pos;
        player.y_position = y_pos;
        player.score = score;

        await player.save();
        return null;
    } catch (error) {
        throw new Error(`Error actualizando los valores del usuario`);
    }
}

async function getPrivateGamesUnfinished(userId) {
    try {
        const status = GAME_STATUS.PAUSED;
        const privateGames = sequelize_game.query(
            `
            SELECT pr.id, pr.name, pr.passwd, pr.maxPlayers, pr.createdAt
            FROM "Users" p, "Privates" pr
            INNER JOIN "Playings" pl ON p.id = pl.id_user AND pl.id_game = pr.id
            WHERE p.id = :userId AND
                pr.id = (
                    SELECT g.id
                    FROM "Games" g
                    WHERE g.id = pr.id AND g.status = :status
                )
            `
            ,{
                replacements: { userId, status },
                type: sequelize_game.QueryTypes.SELECT
            }
        );

        if (!privateGames) {
            return null;
        }

        return privateGames;
    } catch (error) {
        throw new Error(`Error obteniendo partidas privadas no terminadas: ${error.message}`);
    }
}

module.exports = { createPrivateGame, getPrivateGames, joinPrivateGame, deletePrivateGame, getPlayers, isReady, getAllPlayers, getLink, uploadValues, getPrivateGamesUnfinished };
