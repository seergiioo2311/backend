const SeasonPassService = require('../services/seasonPassService');

/**
 * @description Obtener items de un pase de batalla por su ID
 * @param {Request} req - Request de Express 
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve los items del pase de batalla y uno de error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const get_items_from_season_pass = async (req, res) => {
  try {
    const idUser = req.params.idUser;
    const user = await SeasonPassService.checkUser(idUser);
    // Comprobar si el usuario existe
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." }); 
    }
    const idSeasonPass = req.params.idSeasonPass;
    const seasonPass = await SeasonPassService.checkSeasonPass(idSeasonPass);
    // Comprobar si el pase de temporada existe
    if (!seasonPass) {
      return res.status(404).json({ message: "Pase de temporada no encontrado." });
    }
    const items = await SeasonPassService.getItemsFromSeasonPass(idSeasonPass, idUser);
    if (items) {
        res.status(200).json(items);
    } else {
        res.status(404).json({ message: "No se han encontrado items." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 *  @description Devuelve los items de todos los niveles del pase de batalla
 * @param {Request} req - Request de Express 
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve los items de los niveles y uno de error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const get_items_from_levels = async (req, res) => {
  try {
    const idUser = req.params.idUser;
    const user = await SeasonPassService.checkUser(idUser);
    // Comprobar si el usuario existe
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    const items = await SeasonPassService.getItemsFromLevels(idUser);
    if (items) {
      res.status(200).json(items);
    } else {
      res.status(404).json({ message: "No se han encontrado items." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



/**
 * @description Obtener el nivel de un usuario
 * @param {Request} req - Request de Express 
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve el nivel del usuario y uno de error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const get_user_level = async (req, res) => {
  try {
    const idUser = req.params.idUser;
    const user = await SeasonPassService.checkUser(idUser);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    const result = await SeasonPassService.getUserLevel(idUser);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No se ha podido obtener el nivel del usuario." });
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Obtener la experiencia del usuario
 * @param {Request} req - Request de Express 
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve la experiencia del usuario y uno de error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const get_user_experience = async (req, res) => {
  try {
    console.log("get_user_experience");
    const idUser = req.params.idUser;
    const user = await SeasonPassService.checkUser(idUser);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    const result = await SeasonPassService.getUserExperience(idUser);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No se ha podido obtener la experiencia del usuario." });
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Obtener la experiencia necesaria para el siguente nivel
 * @param {Request} req - Request de Express 
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve la experiencia experiencia necesaria para el siguente nivel y uno de error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const get_experience_to_next_level = async (req, res) => {
  try {
    const level = req.params.level;
    const result = await SeasonPassService.getExperienceToNextLevel(level);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No se ha podido obtener la experiencia necesaria para el siguiente nivel." });
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Obtener un booleano para saber si el usuario tiene el pase de batalla de pago
 * @param {Request} req - Request de Express 
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve un booleano y uno de error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const has_user_sp = async (req, res) => {
  try {
    const idUser = req.params.idUser;
    const idSeasonPass = req.params.idSeasonPass;
    const user = await SeasonPassService.checkUser(idUser);
    const seasonPass = await SeasonPassService.checkSeasonPass(idSeasonPass);
    if (!user || !seasonPass) {
      return res.status(404).json({ message: "Usuario o pase de temporada no encontrado." });
    }
    const result = await SeasonPassService.hasUserSP(idUser, idSeasonPass);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No se ha si el usuario ha desbloqueado el pase de pago." });
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

module.exports = { get_items_from_season_pass, get_items_from_levels, get_user_level, get_user_experience, get_experience_to_next_level, has_user_sp };