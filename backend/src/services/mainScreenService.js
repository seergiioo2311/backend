const { QueryTypes } = require('sequelize');
const { sequelize_game } = require('../config/db');
const User = require('../models/User');

/**
 * @description Obtiene el nombre de un usuario por su id 
 * @param {number} userId - El id del usuario
 * @returns {string} - El nombre del usuario o null si no existe
 */
async function getUsernameById(userId) {
  try {
      console.log(`🔍 Buscando usuario con ID: ${userId}`);

      // Verificar que el ID no sea undefined o null antes de buscarlo en la base de datos
      if (!userId) {
          console.warn("⚠️ ID de usuario no proporcionado.");
          return null;
      }

      const user = await User.findByPk(userId, {
          attributes: ["username"] // Solo seleccionamos el campo 'username'
      });

      if (!user) {
          console.warn(`⚠️ No se encontró ningún usuario con el ID: ${userId}`);
          return null; // Retornamos null si no existe
      }

      console.log(`✅ Usuario encontrado: ${user.username}`);
      return user.username;
  } catch (error) {
      console.error("❌ Error al obtener el usuario:", error);
      return null;
  }
}

/**
 * @description Obtiene el nombre de un usuario por su id 
 * @param {number} username - El username del usuario
 * @returns {uuid} - El id del usuario o null si no existe
 */
async function getIdByUsername(username) {
  try {
      console.log(`🔍 Buscando usuario con nombre de usuario: ${username}`);

      // Verificar que el username no sea undefined o null antes de buscarlo en la base de datos
      if (!username) {
          console.warn("⚠️ Nombre de usuario no proporcionado.");
          return null;
      }

      const user = await User.findOne({
          where: { username: username }, // Filtramos por el campo 'username'
          attributes: ["id"] // Solo seleccionamos el campo 'id'
      });

      if (!user) {
          console.warn(`⚠️ No se encontró ningún usuario con el nombre de usuario: ${username}`);
          return null; // Retornamos null si no existe
      }

      console.log(`✅ Usuario encontrado: ${user.id}`);
      return user.id;
  } catch (error) {
      console.error("❌ Error al obtener el ID del usuario:", error);
      return null;
  }
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
    const [connectionRows] = await User.update(
      { status: true },
      { where: { id: userId } }
    );

    if(updatedRows == 0 || connectionRows == 0) {
      throw new Error('Usuario no encontrado');
    }
    return {message: 'Usuario actualizado'};
  }
  catch (error) {
    return {message: error.message};
  }
}

/**
 * @description Obtiene todas las skins desbloqueadas por un usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un mensaje de éxito si se actualiza la conexión y uno de error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
async function getUnlockedSkins(userId) {
  try {
    const [results, metadata] = await sequelize_game.query(
      `SELECT i.*
        FROM Items i
        WHERE i.type = "Skin"
        JOIN UserItems ui ON i.id = ui.id_item
        WHERE ui.id_user = ${userId}
      ` 
      ,{
        type: QueryTypes.SELECT
      });
    return results;
  }
  catch (error) {
    return {message: error.message};
  }
}

module.exports = { getUsernameById, getIdByUsername, updateConnection, getUnlockedSkins };
