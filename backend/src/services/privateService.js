const Priv = require('../models/Private');
const { Playing, PLAYER_STATUS } = require('../models/Playing');
const { Game, GAME_STATUS } = require('../models/Game');
const { Op } = require('sequelize');
const axios = require('axios');
const { Json } = require('sequelize/lib/utils');
const { sequelize_game } = require('../config/db');
const { v4: uuidv4 } = require('uuid'); 
const User = require('../models/User');


/**
 * @description Crea una partida privada nueva
 * @param {string} passwd - Contraseña de la partida privada
 * @param {number} maxPlayers - Número máximo de jugadores
 * @param {uuid} idLeader - Id del jugador que crea la partida privada
 * @returns {Json} - Devuelve la partida privada creada
 * @throws {Error} - Maneja errores internos del servidor
 */
async function createPrivateGame(name, passwd, maxPlayers, idLeader) {
    try{
        //Esta funcion está aun por implementar correctamente, el esqueleto basico es correcto, pero necesitaremos saber los endpoints reales para así, tener esto funcionando correctamente
        //Obtenemos el endpoint donde se ejecutará la partida
        //const response = await axios.get('http://localhost:3000/api/privateGames'); //? Este endpoint está aun por definir ya que lo proporciona el equipo de game_server
        //const link1 = response.data.gameEndpoint; //el nombre de esta variable tambien esta por definir, ya que depende de la respuesta del equipo de game_server
        // TODO: HAY QUE ELIMINAR ESTA LINEA, ESTO ES SOLO PARA TESTING
        const link = 'http://localhost:9091'; // FIXME: Este endpoint está aun por definir ya que lo proporciona el equipo de game_server, el actual esta proporcionado por el equipo
        const gameId = uuidv4().slice(0, 6);; //Generamos un id único para la partida privada
        
        if(!link) {
            throw new Error('No se pudo obtener el endpoint de la partida privada');
        }

        console.log("Hola mundo");

        const newGame = await Game.create({
            status: GAME_STATUS.ACTIVE,
        });
        console.log("game id:", newGame.id);


        const newPrivateGame = await Priv.create({
            id: newGame.id,
            unique_code: gameId,
            passwd,
            name,
            link,
            maxPlayers,
            leader: idLeader,
            currentPlayers: 0
        });

        return { link: newPrivateGame.link, id: newGame.id };
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
async function getPrivateGames(gameId, passwd) {
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
        return { privateGame: privateGame };
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
async function joinPrivateGame(gameId, passwd, userId) {
    try {
        const privateGame = await Priv.findOne({
            where: {
                id: gameId,
                passwd: passwd
            }
        });

        //incrementamos el número de jugadores de la partida privada
        if (privateGame) {
            privateGame.currentPlayers += 1;
            await privateGame.save();
        }

        if (!privateGame) {
            console.log("No se ha encontrado la partida privada o la contraseña es incorrecta");
            return null;
        }

        const playing = await Playing.create({
            id_user: userId,
            id_game: gameId,
            status: PLAYER_STATUS.WAITING,
            n_divisions: 0,
            x_position: 0,
            y_position: 0,
            score: 0
        })

        console.log("jugador:", playing.id_user, "partida privada:", playing.id_game, "status:", playing.status, "n_divisions:", playing.n_divisions, "x_position:", playing.x_position, "y_position:", playing.y_position, "score:", playing.score);

        if (!playing) {
            console.log("No se ha podido unir a la partida privada");
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
        console.log(`🗑️ Eliminando partida privada con gameId: ${gameId}`);
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

        if (!playing) {
            return -1;
        }

        playing.status = PLAYER_STATUS.READY;
        await playing.save();

        return null;
    } catch (error) {
        throw new Error(`Error obteniendo jugadores de la partida privada: ${error.message}`);
    }
}

/**
 * @description Obtiene todos los jugadores de una partida privada.
 * @param {Number} gameId - Id de la partida privada
 * @returns {Json} - Devuelve los jugadores de la partida privada y error en caso de error
 */
async function getAllPlayers(gameId) {
    try {
        const jugadores = await Playing.findAll({
            where: {
                id_game: gameId
            }
        });

        if (!jugadores) {
            throw new Error('No se han encontrado jugadores en la partida privada');
        }

        const players = await Promise.all(jugadores.map(async (player) => {
            const user = await User.findOne({
                where: {
                    id: player.id_user
                }
            });
            return {
                id: user.id,
                name: user.username,
                status: player.status,
            };
        }
        ));

        return { players };
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
                    [Op.or]: [PLAYER_STATUS.READY, PLAYER_STATUS.ALIVE]
                }
            }
        });
        
        const current = await Playing.count({
            where: {
                id_game: gameId,
            }
        });

        console.log("res:", res, "currentPlayers:", privateGame.currentPlayers, "current:", current);

        if (res < current) {
            throw new Error('No se puede obtener el link, hay jugadores pendientes de dar listo');
        }

        return privateGame.link;
    } catch (error) {
        throw new Error(`Error obteniendo el link de la partida privada: ${error.message}`);
    }
}

/**
 * @description Actualiza todos los valores de una partida privada
 * @param {Number} gameId - Id de la partida privada
 * @param {} values
 * @returns - Devuelve null, en el caso de que se haya actualizado correctamente, o -1, en el caso de que no haya encontrado la partida privada, o lanza un error en caso de error
 */
async function uploadValues(gameId, values) {
    try {
        console.log("uploadValues called with gameId:", gameId);
        console.log("Received values:", JSON.stringify(values, null, 2));
        
        // Asegurarse de que values es un array
        let valuesArray = values;
        
        // Si values no es un array pero tiene una propiedad 'values' que es un array, usar esa
        if (!Array.isArray(values) && values && Array.isArray(values.values)) {
            valuesArray = values.values;
        } 
        // Si values es un objeto único, convertirlo en un array
        else if (!Array.isArray(values) && values) {
            valuesArray = [values];
        }
        
        // Si después de todo no tenemos un array, creamos uno vacío
        if (!Array.isArray(valuesArray)) {
            valuesArray = [];
            console.log("Warning: values is not in the expected format");
        }

        const privateGame = await Priv.findOne({
            where: {
                id: gameId
            }
        });

        if (!privateGame) {
            console.log("Private game not found with id:", gameId);
            return -1;
        }

        // Pero que hay un values por cada jugador, entonces hay que recorrer los jugadores y actualizar los valores de cada uno
        const players = await Playing.findAll({
            where: {
                id_game: gameId
            }
        });

        console.log("Found players:", players.map(p => p.id_user));

        await Promise.all(players.map(async (player) => {  // Cambio de forEach a map
            // Buscar los valores del jugador, considerando ambas estructuras posibles (id_user o PlayerID)
            const playerValues = valuesArray.find((value) => 
                (value.id_user && value.id_user === player.id_user) || 
                (value.PlayerID && value.PlayerID === player.id_user)  // Añadido soporte para PlayerID
            );
            
            if (playerValues) {
                console.log("Updating player:", player.id_user, "with values:", JSON.stringify(playerValues));
                
                // Verificar cada valor explícitamente para evitar valores 0
                if (playerValues.x_position !== undefined) {
                    player.x_position = playerValues.x_position;
                } else if (playerValues.X !== undefined) {
                    player.x_position = playerValues.X;
                }
                
                if (playerValues.y_position !== undefined) {
                    player.y_position = playerValues.y_position;
                } else if (playerValues.Y !== undefined) {
                    player.y_position = playerValues.Y;
                }
                
                if (playerValues.score !== undefined) {
                    player.score = playerValues.score;
                } else if (playerValues.Score !== undefined) {
                    player.score = playerValues.Score;
                }
                
                console.log("Player values after update:", {
                    id_user: player.id_user,
                    x_position: player.x_position,
                    y_position: player.y_position,
                    score: player.score
                });
                
                await player.save();
                console.log("Player updated successfully");
            } else {
                console.log("No values found for player:", player.id_user);
            }
        }));

        return null;
    } catch (error) {
        console.error("Error in uploadValues:", error);
        throw new Error(`Error actualizando los valores del usuario: ${error.message}`);
    }
}

/**
 * @description Obtiene los valores de una partida privada
 * @param {Number} gameId - Id de la partida privada
 * @returns {Json} - Devuelve los valores de la partida privada y error en caso de error
 */
async function getValues(gameId) {
    try {
        console.log("getValues called with gameId:", gameId);
        
        const privateGame = await Priv.findOne({
            where: {
                id: gameId
            }
        });

        if (!privateGame) {
            console.log("Private game not found with id:", gameId);
            throw new Error('Partida privada no encontrada');
        }

        const players = await Playing.findAll({
            where: {
                id_game: gameId
            }
        });
        
        console.log("Found players:", players.length);

        // si es la primera vez de la partida, enviar un array vacio
        if (privateGame.isFirstGame) {
            console.log("First game, returning empty array");
            privateGame.isFirstGame = false;
            await privateGame.save();
            return [];
        }

        const values = players.map((player) => {
            const playerValues = {
                id_user: player.id_user,
                x_position: player.x_position,
                y_position: player.y_position,
                score: player.score
            };
            console.log("Player values:", JSON.stringify(playerValues));
            return playerValues;
        });

        console.log("Returning values:", JSON.stringify(values));
        return values;
    } catch (error) {
        console.error("Error in getValues:", error);
        throw new Error(`Error obteniendo los valores de la partida privada: ${error.message}`);
    }
}
/**
 * @description Obtiene todas las partidas privadas pausadas de un usuario
 * @param {Number} userId - Id del usuario
 * @returns {Json} - Devuelve todas las partidas privadas pausadas del usuario y error en caso de error
 */
async function getPrivateGamesUnfinished(userId) {
    try {
        console.log(`🔍 Buscando partidas privadas no finalizadas para el usuario ${userId}`);
        const status = GAME_STATUS.PAUSED;
        console.log(`🔹 Estado a buscar: ${status}`);

        // Consulta SQL personalizada para obtener las partidas privadas pausadas del usuario
        console.log(`🔄 Ejecutando consulta SQL para obtener partidas pausadas`);
        const privateGames = await sequelize_game.query(
            `
            SELECT 
                *
            FROM "Privates" pr
            INNER JOIN "Playings" pl ON pl.id_game = pr.id
            INNER JOIN "Games" g ON g.id = pr.id
            WHERE pl.id_user = :userId AND g.status = :status
            `,
            {
                replacements: { userId, status },
                type: sequelize_game.QueryTypes.SELECT
            }
        );

        if (!privateGames || privateGames.length === 0) {
            console.log(`ℹ️ No se encontraron partidas pausadas para el usuario ${userId}`);
            return null;
        }

        console.log(`✅ Se encontraron ${privateGames.length} partidas pausadas para el usuario ${userId}`);
        console.log(`📊 Primera partida encontrada: ID=${privateGames[0].id}, Nombre=${privateGames[0].name}`);
        
        return privateGames;
    } catch (error) {
        console.error(`❌ ERROR al obtener partidas privadas no terminadas: ${error.message}`, error);
        throw new Error(`Error obteniendo partidas privadas no terminadas: ${error.message}`);
    }
}

/**
 * @description Obtiene una partida privada por su código
 * @param {string} unique_id - Id de la partida privada
 * @returns {Json} - Devuelve la partida privada y error en caso de error
 */
async function getGameWithId(gameCode) {
    try {
        const trimmedGameCode = gameCode.trim();
        const privateGame = await Priv.findOne({
            where: {
                unique_code: {
                    [Op.iLike]: trimmedGameCode
                }
            }
        });

        if (!privateGame) {
            throw new Error('Partida privada no encontrada');
        }

        return privateGame;
    } catch (error) {
        throw new Error(`Error obteniendo la partida privada: ${error.message}`);
    }
}

/**
 * @description Elimina un jugador de una partida privada
 * @param {string} gameId - Id de la partida privada
 * @param {string} userId - Id del jugador
 * @returns {Json} - Devuelve null si se ha eliminado correctamente, -1 si no se ha encontrado la partida privada o el jugador
 * @throws {Error} - Maneja errores internos del servidor
 */
async function deleteUserFromPrivateGame(gameId, userId) {
    try {
        console.log(`🗑️ Eliminando jugador ${userId} de la partida privada ${gameId}`);
        const privateGame = await Priv.findOne({
            where: {
                id: gameId
            }
        });

        if (!privateGame) {
            return -1;
        }

        const player = await Playing.findOne({
            where: {
                id_game: gameId,
                id_user: userId
            }
        });

        if (!player) {
            return -1;
        }

        await player.destroy();
        privateGame.currentPlayers -= 1;
        await privateGame.save();

        return null;
    } catch (error) {
        throw new Error(`Error eliminando jugador de la partida privada: ${error.message}`);
    }
}

/**
 * @description Inicia una partida privada
 * @param {string} gameId - Id de la partida privada
 * @returns {Json} - Devuelve null si se ha iniciado correctamente, -1 si no se ha encontrado la partida privada 
 * @throws {Error} - Maneja errores internos del servidor
 */
async function startPrivateGame(gameId) {
    try {
        console.log(`🟢 Iniciando partida privada con gameId: ${gameId}`);
        
        const privateGame = await Priv.findOne({
            where: {
                id: gameId
            }
        });

        if (!privateGame) {
            console.log(`❌ No se encontró la partida privada con ID: ${gameId}`);
            return -1;
        }
        console.log(`✅ Partida privada encontrada: ${JSON.stringify(privateGame.dataValues)}`);

        const game = await Game.findOne({
            where: {
                id: gameId
            }
        });

        if (!game) {
            console.log(`❌ No se encontró el juego base con ID: ${gameId}`);
            return -1;
        }
        console.log(`✅ Juego encontrado. Estado actual: ${game.status}`);

        game.status = GAME_STATUS.ACTIVE;
        console.log(`🔄 Cambiando estado del juego a: ${GAME_STATUS.ACTIVE}`);
        await game.save();
        console.log(`✅ Estado del juego actualizado correctamente`);

        // Poner todos los jugadores a "ALIVE"
        const players = await Playing.findAll({
            where: {
                id_game: gameId
            }
        });
        console.log(`🔍 Encontrados ${players.length} jugadores en la partida`);

        await Promise.all(players.map(async (player) => {
            console.log(`🔄 Actualizando jugador ${player.id_user} de estado ${player.status} a ${PLAYER_STATUS.ALIVE}`);
            player.status = PLAYER_STATUS.ALIVE;
            await player.save();
            console.log(`✅ Jugador ${player.id_user} actualizado correctamente`);
        }));

        console.log(`🎮 Partida privada ${gameId} iniciada con éxito`);
        return null;
    } catch (error) {
        console.error(`❌ ERROR iniciando partida privada: ${error.message}`, error);
        throw new Error(`Error iniciando partida privada: ${error.message}`);
    }
}

/**
 * @description Pausa una partida privada
 * @param {string} gameId - Id de la partida privada
 * @returns {Json} - Devuelve null si se ha pausado correctamente, -1 si no se ha encontrado la partida privada 
 * @throws {Error} - Maneja errores internos del servidor
 */
async function pausePrivateGame(gameId) {
    try {
        console.log(`⏸️ Pausando partida privada con gameId: ${gameId}`);
        
        const privateGame = await Priv.findOne({
            where: {
                id: gameId
            }
        });

        if (!privateGame) {
            console.log(`❌ No se encontró la partida privada con ID: ${gameId}`);
            return -1;
        }
        console.log(`✅ Partida privada encontrada: ${JSON.stringify(privateGame.dataValues)}`);

        const game = await Game.findOne({
            where: {
                id: gameId
            }
        });

        if (!game) {
            console.log(`❌ No se encontró el juego base con ID: ${gameId}`);
            return -1;
        }
        console.log(`✅ Juego encontrado. Estado actual: ${game.status}`);

        game.status = GAME_STATUS.PAUSED;
        console.log(`🔄 Cambiando estado del juego a: ${GAME_STATUS.PAUSED}`);
        await game.save();
        console.log(`✅ Estado del juego actualizado correctamente`);

        // Poner todos los jugadores a "WAITING"
        const players = await Playing.findAll({
            where: {
                id_game: gameId
            }
        });
        console.log(`🔍 Encontrados ${players.length} jugadores en la partida`);

        await Promise.all(players.map(async (player) => {
            console.log(`🔄 Actualizando jugador ${player.id_user} de estado ${player.status} a ${PLAYER_STATUS.WAITING}`);
            player.status = PLAYER_STATUS.WAITING;
            await player.save();
            console.log(`✅ Jugador ${player.id_user} actualizado correctamente`);
        }));

        console.log(`⏸️ Partida privada ${gameId} pausada con éxito`);
        return null;
    } catch (error) {
        console.error(`❌ ERROR pausando partida privada: ${error.message}`, error);
        throw new Error(`Error pausando partida privada: ${error.message}`);
    }
}


module.exports = { createPrivateGame, getPrivateGames, joinPrivateGame, deletePrivateGame, getPlayers, isReady, 
    getAllPlayers, getLink, uploadValues, getValues, getPrivateGamesUnfinished, getPrivateGameWithId, 
    getGameWithId, deleteUserFromPrivateGame, startPrivateGame, pausePrivateGame };
