const User = require('../models/User');

/**
 * @description Obtiene el nombre de un usuario por su id 
 * @param {number} userId - El id del usuario
 * @returns {string} - El nombre del usuario o null si no existe
 */
async function getUsernameById(userId) {
    const user = await User.findByPk(userId, {
        attributes: ['name'] // Selecciona solo el campo 'name'
    });
    return user ? user.name : null; // Retorna solo el nombre o null si no existe
}

/**
 * @description Actualiza la fecha de última conexión de un usuario
 * @param {number} userId - El id del usuario
 * @returns {object} - Un objeto con un mensaje de éxito o error
 * @throws {Error} - Si no se encuentra
 */
async function updateConnection(userId) {
  try {
    const [updatedRows] = await User.update(
      { lastConnection: new Date() },
      { where: { id: userId } }
    );
    if(updatedRows > 0) {
      throw new Error('Usuario no encontrado');
    }
    return {message: 'Usuario actualizado'};
  }
  catch (error) {
    return {message: error.message};
  }
}

module.exports = { getUsernameById, updateConnection };
