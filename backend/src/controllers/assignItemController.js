const storeService = require('../services/storeService');

/**
 * @description Asigna un item a un usuario.
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un mensaje de éxito si se asigna el item y uno de error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const assignItem = async (req, res) => {
  try {
    const { user_id, item_id } = req.body;
    const userItem = await storeService.assignItem(user_id, item_id);
    if (userItem) {
      res.status(200).json({ message: "Item asignado correctamente" });
    }
    else {
      res.status(404).json({ message: "El id de item o el id de usuario son incorrectos" });
    }
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @description Obtiene todos los items de un usuario.
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un array con todos los items del usuario y uno de error en caso de error 
 * @throws {Error} - Maneja errores internos del servidor
 */
const getAllItems = async (req, res) => {
  try {
    const { user_id } = req.body;
    const items = await storeService.getAllItems(user_id);
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { assignItem, getAllItems };
