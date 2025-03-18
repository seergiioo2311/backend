const mainScreenService = require('../services/mainScreenService');

/**
 * @description Obtener el nombre de usuario dado el id de usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve el nombre de usuario si se encuentra un usuario con el id dado
 * @throws {Error} - Maneja errores internos del servidor
 */
const get_user = async (req, res) => {
  try{
    const user = req.params.id;
    const user_by_id = mainScreenService.getUsernameById(user);
    if(user_by_id) {
      res.status(200).json(user_by_id);
    }
    else{
      res.status(404).json({message: "Ususario no encontrado"});
    }
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Actualiza la fecha de última conexión del usuario dado un id de usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un mensaje de éxito si se actualiza la conexión y uno de error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const update_connection = async (req, res) => {
  try {
    const user_id = req.params.id;
    const to_update_user = mainScreenService.getUsernameById(user_id);
    
    //En caso de no encontrar el usuario
    if(!to_update_user) {
      res.status(404).json({message: "Usuario no encontrado"});
    }
    
    const result = await mainScreenService.updateConnection(user_id);
    res.status(200).json(result);
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Obtiene todas las skins desbloqueadas por un usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un mensaje de éxito si se actualiza la conexión y uno de error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const get_unlocked_skins = async(req, res) => {
  try {
    const user_id = req.params.id;
    const user = mainScreenService.getUsernameById(user_id);
    
    if(!user) {
      res.status(404).json({message: "Usuario no encontrado"});
    }

    const result = mainScreenService.getUnlockedSkins(user_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

module.exports = { get_user, update_connection, get_unlocked_skins };
