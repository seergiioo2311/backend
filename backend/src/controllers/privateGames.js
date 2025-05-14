/***************
 * Fichero con los controladores de los juegos privados para la API
 ***************/
const { response } = require('express');
const { Op } = require('sequelize');
const PrivateService = require('../services/privateService');

/**
 * @description Crea una partida privada nueva
 * @param {Request} req - Request de Express 
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve la partida privada creada y uno de error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const createPrivateGame = async (req, res) => {
    try {
        console.log("createPrivateGame: ", req.body);
        const { passwd, maxPlayers, name, idLeader } = req.body;
        
        if( !name || !passwd || !maxPlayers || maxPlayers < 2 || !idLeader) {
            return res.status(500).json({ message: "Contraseña y número máximo de jugadores son obligatorios, además que maxPlayers debe ser menor o igual a 2" });
        }

        const newPrivateGame = await PrivateService.createPrivateGame(name, passwd, maxPlayers, idLeader);
        res.status(200).json(newPrivateGame);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Obtiene una partida privada a partir de un identificador único
 * @param {Request} req - Request de Express 
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve la partida privada obtenida, en caso de existir, sino error
 * @throws {Error} - Maneja errores internos del servidor
 */ 
const getPrivateGameWithId = async (req, res) => {
    try {
    
        const gameId = req.params.gameId;
        
        if(!gameId){
            res.status(500).json({ message: error.message });    
        }
        
        const privateGame = await PrivateService.getPrivateGameWithId(gameId);
        
        if(!privateGame) {
            res.status(500).json({message: "No se ha encontrado la partida privada."});
        }
        
        res.status(200).json(privateGame);

    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Obtiene todas las partidas privadas
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve las partida privada y error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const getPrivateGame = async (req, res) => {
    try {
        const { gameId, passwd } = req.body;
        if (!gameId || !passwd) {
            return res.status(500).json({ message: "ID de partida privada y contraseña son obligatorios" });
        }

        const privateGames = await PrivateService.getPrivateGames(gameId, passwd);
        res.status(200).json(privateGames);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description función para unirse a una partida privada
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve la partida privada y error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const joinPrivateGame = async (req, res) => {
    try {
        const { gameId, passwd, idUser } = req.body;
        if (!gameId || !passwd || !idUser) {
            return res.status(500).json({ message: "ID de partida privada y contraseña son obligatorios" });
        }
        
        console.log("ID de partida privada: ", gameId);

        const privateGame = await PrivateService.joinPrivateGame(gameId, passwd, idUser);
        if (privateGame) {
            res.status(200).json(privateGame);
        } else {
            res.status(404).json({ message: "Partida privada no encontrada o contraseña incorrecta" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Elimina una partida privada
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve confirmacion o error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const deletePrivateGame = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "ID de partida privada no proporcionada" });
        }

        const deletedPrivateGame = await PrivateService.deletePrivateGame(id);
        if (deletedPrivateGame) {
            res.status(200).json({ message: "Partida privada eliminada correctamente" });
        } else {
            res.status(404).json({ message: "Partida privada no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Obtiene los jugadores de una partida privada
 * @param {Request} req - Request de Express 
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve el  numero de jugadores de la partida privada y error en caso de error
 */
const getPlayers = async (req, res) => {
    try {
        const { gameId } = req.params;
        
        console.log("getPlayers: ", gameId);

        if(!gameId) {
            return res.status(500).json({ message: "ID de partida privada no proporcionada" });
        }

        const players = await PrivateService.getPlayers(gameId);

        if (players != null) {
            res.status(200).json({players: players});
        } else {
            res.status(404).json({ message: "Partida privada no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Marca a un jugador como listo en una partida privada
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve confirmacion o error en caso de error
 */
const isReady = async (req, res) => {
    try {
        const { gameId, userId } = req.body;
        console.log("isReady: ", gameId, userId);

        if(!gameId) {
            return res.status(500).json({ message: "ID de partida privada no proporcionada" });
        }

        if (!userId) {
            return res.status(500).json({ message: "ID de usuario no proporcionada" });
        }

        const resP = await PrivateService.isReady(gameId, userId);
        if (resP === -1) {
            return res.status(404).json({ message: "Partida privada no encontrada" });
        } else if (resP === null) {
            res.status(200).json({ message: "El usuario se ha marcado que está listo" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Obtiene todos los jugadores de una partida privada
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve los jugadores de la partida privada y error en caso de error
 */
const getAllPlayers = async (req, res) => {
    try {
        const { gameId } = req.params;

        if(!gameId) {
            return res.status(500).json({ message: "ID de partida privada no proporcionada" });
        }

        const players = await PrivateService.getAllPlayers(gameId);
        if (players) {
            res.status(200).json({players: players});
        } else {
            res.status(404).json({ message: "Partida privada no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Obtiene el link de una partida privada
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve el link de la partida privada y error en caso de error
 */
const getLink = async (req, res) => {
    try {
        const { gameId } = req.params;

        if (!gameId) {
            return res.status(500).json({ message: "ID de partida privada no proporcionada" });
        }

        const link = await PrivateService.getLink(gameId);
        res.status(200).json(link);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Actualiza los valores para todos los jugadores de una partida privada
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve mensaje de confirmación o de error
 */
const uploadValues = async(req, res) => {
    try {
        const { gameId } = req.params;
        const  values  = req.body;

        if (!gameId) {
            return res.status(500).json({ message: "ID de partida privada no proporcionada" });
        }

        if (!values) {
            return res.status(500).json({ message: "Valores no proporcionados" });
        }

        const result = await PrivateService.uploadValues(gameId, values);
        if (result === -1) {
            return res.status(404).json({ message: "No se ha encontrado la partida privada" });
        } else {
            res.status(200).json({ message: "Valores actualizados correctamente" });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

/**
 * @description Obtiene todos los valores para todos los jugadores de una partida privada
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve mensaje de confirmación o de error
 */
const getValues = async(req, res) => {
    try {
        const { gameId } = req.params;

        if (!gameId) {
            return res.status(500).json({ message: "ID de partida privada no proporcionada" });
        }

        const values = await PrivateService.getValues(gameId);
        if (values === -1) {
            return res.status(404).json({ message: "No se ha encontrado la partida privada" });
        } else {
            res.status(200).json(values);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Devuelve todas las partidas privada pausadas del usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve mensaje de confirmación o de error
 */
const getPrivateGamesUnfinished = async (req, res) => {
    try {
        const { userId } = req.params;

        console.log("getPrivateGamesUnfinished: ", userId);
        
        if (!userId) {
            return res.status(500).json({ message: "ID de usuario no proporcionada" });
        }

        const privateGames = await PrivateService.getPrivateGamesUnfinished(userId);
        if (!privateGames) {
            return res.status(404).json({ message: "No se han encontrado partidas privadas" });
        }
        else {
            res.status(200).json(privateGames);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


/**
 * @description Obtiene una partida privada a partir de un código único 
 * @param {Request} req - Request de Express 
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve la partida privada obtenida, en caso de existir, sino error
 * @throws {Error} - Maneja errores internos del servidor
 */
const getGameWithCode = async (req, res) => {
    try {
        const { gameCode } = req.params;
        
        if(!gameCode) {
            return res.status(500).json({ message: "ID de partida privada no proporcionada" });
        }
        const privateGame = await PrivateService.getGameWithId(gameCode);
        if(!privateGame) {
            res.status(500).json({message: "No se ha encontrado la partida privada."});
        }
        res.status(200).json({ game: privateGame });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Elimina un jugador de una partida privada
 * @param {Request} req - Request de Express 
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve la partida privada obtenida, en caso de existir, sino error
 * @throws {Error} - Maneja errores internos del servidor
 */
const deleteUserFromPrivateGame = async (req, res) => {
    try {
        const { gameId, userId } = req.params;

        if (!gameId || !userId) {
            return res.status(400).json({ message: "gameId y userId son obligatorios" });
        }

        const result = await PrivateService.deleteUserFromPrivateGame(gameId, userId);

        if (result === -1) {
            return res.status(404).json({ message: "No se encontró la partida privada o el jugador" });
        }

        return res.status(200).json({ message: "Jugador eliminado correctamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * @description Inicia una partida privada
 * @param {Request} req - Request de Express 
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve un mensaje, en caso de existir, sino error
 * @throws {Error} - Maneja errores internos del servidor
 */
const startPrivateGame = async (req, res) => {
    try {
        const { gameId } = req.body;
        
        if(!gameId) {
            return res.status(500).json({ message: "ID de partida privada no proporcionada" });
        }

        const res1 = await PrivateService.startPrivateGame(gameId);
        if (!res1 == "-1") {
            return res.status(404).json({ message: "No se ha encontrado la partida privada" });
        } else if (res1 == null){
            res.status(200).json({ message: "Partida privada iniciada correctamente" });
        }
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Pausa una partida privada
 * @param {Request} req - Request de Express 
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve la partida privada obtenida, en caso de existir, sino error
 * @throws {Error} - Maneja errores internos del servidor
 */
const pausePrivateGame = async (req, res) => {
    try {
        const { gameId } = req.body;
        
        if(!gameId) {
            return res.status(500).json({ message: "ID de partida privada no proporcionada" });
        }

        const res1 = await PrivateService.pausePrivateGame(gameId);
        if(!res1 == "-1") {
            return res.status(404).json({ message: "No se ha encontrado la partida privada" });
        }
        else if (res1 == null) {
            res.status(200).json({ message: "Partida privada pausada correctamente" });
        }
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { createPrivateGame, getPrivateGame, joinPrivateGame, deletePrivateGame, 
    getPlayers, isReady, getAllPlayers, getLink, uploadValues, getValues, getPrivateGamesUnfinished, 
    getGameWithCode, deleteUserFromPrivateGame, startPrivateGame, pausePrivateGame };
