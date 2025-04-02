const achService = require('../services/achievementService');

/**
 * @description Obtiene los logros de un usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve los logros del usuario
 * @throws {Error} - Maneja errores internos del servidor
 */
const get_achievements = async (req, res) => {
  try {
    const user_id = req.params.id;
    const result1 = await achService.checkUser(user_id);
    //Si el usuario no existe en la base de datos
    if (!result1) {
      console.log("Usuario no encontrado");
      throw new Error("User not found");
    }
    const achievements = await achService.getAchievements(user_id);

    //Si el usuario no existe en la base de datos
    if (!achievements) {
      throw new Error("Error al obtener los logros");
    }

    res.status(200).json(achievements);
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
}

/**
* @description Desbloquea un logro de un usuario
* @param {Request} req - Request de Express
* @param {Response} res - Response de Express
* @returns {Response} - Devuelve el logro desbloqueado
* @throws {Error} - Maneja errores internos del servidor
*/
const unlock_achievement = async (req, res) => {
    try {
        const user_id = req.body.user_id;

        const result1 = await achService.checkUser(user_id);
        //Si el usuario no existe en la base de datos
        if (!result1) {
          console.log("Usuario no encontrado");
          throw new Error("User not found");
        }

        const achievement_id = req.body.achievement_id;
    
        const result = await achService.unlockAchievement(user_id, achievement_id);
    
        //Si el usuario no existe en la base de datos
        if (!result) {
        throw new Error("Error al reclamar el logro");
        }
    
        res.status(200).json(result);
    }
    catch(error) {
        res.status(500).json({message: error.message});
    }
}

/**
* @description Actualiza los logros de un tipo
* @param {Request} req - Request de Express
* @param {Response} res - Response de Express
* @returns {Response} - Devuelve el logro desbloqueado
* @throws {Error} - Maneja errores internos del servidor
*/
const update_achievement = async (req, res) => {
  try {
      const user_id = req.body.user_id;
      const type = req.body.achievement_type;
      const quantity = req.body.quantity;

      const result1 = await achService.checkUser(user_id);
      //Si el usuario no existe en la base de datos
      if (!result1) {
        console.log("Usuario no encontrado");
        throw new Error("User not found");
      }
  
      const result = await achService.updateAchievement(user_id, type, quantity);
  
      //Si el usuario no existe en la base de datos
      if (!result) {
      throw new Error("Error al actualizar los logros");
      }
  
      res.status(200).json(result);
  }
  catch(error) {
      res.status(500).json({message: error.message});
  }
}


module.exports = {
  get_achievements,
  unlock_achievement,
  update_achievement
};
