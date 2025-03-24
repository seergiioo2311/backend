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
    const user = req.params.id;
    const achievements = await achService.getAchievements(user);

    //Si el usuario no existe en la base de datos
    if (!achievements) {
      throw new Error("User not found");
    }

    res.status(200).json(achievements);
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Obtiene los logros no obtenidos de un usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve los logros no obtenidos del usuario
 * @throws {Error} - Maneja errores internos del servidor
 */
const get_unachieved_achievements = async (req, res) => {
  try {
    const user = req.params.id;
    const achievements = await achService.getUnachievedAchievements(user);

    //Si el usuario no existe en la base de datos
    if (!achievements) {
      throw new Error("User not found");
    }
    res.status(200).json(achievements);
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
}

module.exports = {
  get_achievements,
  get_unachieved_achievements
};
