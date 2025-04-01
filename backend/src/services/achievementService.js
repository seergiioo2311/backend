const ach = require('../models/Achievement.js');
const userArch = require('../models/User_achievement.js');
const { Op } = require('sequelize');

/** 
 * @description Obtiene los logros de un usuario
 * @param {number} userId - El id del usuario
 * @returns {Json} - Un objeto con los logros del usuario
 */
async function getAchievements(userId) {
  try {

    // Consulta de logros obtenidos por el usuario
    const userAchievements = await userArch.findAll({
      where: { id_user: userId, achieved: true },
      attributes: ['id_achievement'],
      raw: true // ← Resultados como objetos planos
    });

    // Si no hay logros, retornar array vacío inmediatamente
    if (userAchievements.length === 0) {
      return [];
    }

    // Extraer IDs y asegurar que sean únicos
    const achievementIds = [...new Set(
      userAchievements.map(ua => ua.id_achievement)
    )];

    // Obtener detalles de los logros
    const achievements = await ach.findAll({
      where: { id: achievementIds },
      raw: true // ← Resultados limpios
    });

    return {achievements: achievements};


  } catch (error) {
    // Mejorar mensaje de error para debugging
    throw new Error(`Error obteniendo logros (Usuario ${userId}): ${error.message}`);
  }
}

/** 
 * @description devuelve el listado de logros no obtenidos por el usuario 
 * @param {number} userId - El id del usuario
 * @returns {Json} - Un objeto con los logros no obtenidos del usuario y el porcentaje de logros obtenidos
 */
async function getUnachievedAchievements(userId) {
  try {
    
    // Obtener datos en paralelo
    const [unachieved, obtainedCount, totalRows] = await Promise.all([
      // Logros no obtenidos
      userArch.findAll({
        where: { id_user: userId, achieved: false },
        attributes: ['id_achievement'],
        raw: true
      }),
      
      // Conteo de logros obtenidos
      userArch.count({ where: { id_user: userId, achieved: true } }),
      
      // Total de logros en el sistema
      ach.count()
    ]);

    // Si no hay logros no obtenidos
    if (unachieved.length === 0) {
      return {
        percentage: totalRows === 0 ? 0 : (obtainedCount / totalRows) * 100,
        achievements: []
      };
    }

    const achievementIds = unachieved.map(ua => ua.id_achievement);

    // Validar si hay IDs antes de consultar
    if (achievementIds.length === 0) {
      return [];
    }

    const achievements = await ach.findAll({
      where: {
        id: {
          [Op.in]: achievementIds
        }
      },
      attributes: ['id', 'name', 'description'], // Nombres en inglés según modelo
      raw: true
    });

    
    
    return {
      percentage: totalRows === 0 ? 0 : (obtainedCount / totalRows) * 100,
      achievements: achievements
    };
    
  } catch (error) {
    throw new Error(`Error en logros no obtenidos (Usuario ${userId}): ${error.message}`);
  }
}

/**
* @description Desbloquea un logro de un usuario
* @param {number} userId - El id del usuario
* @param {number} achievementId - El id del logro
* @returns {Json} - Un objeto con el logro desbloqueado
* @throws {Error} - Maneja errores internos del servidor
*/
async function unlockAchievement(userId, achievementId) {
  try {
    // Verificar si el logro ya está desbloqueado
    const existingAchievement = await userArch.findOne({
      where: { id_user: userId, id_achievement: achievementId, achieved: true }
    });

    if (existingAchievement) {
      throw new Error('Achievement already unlocked');
    }

    // Crear nuevo registro de logro desbloqueado
    const newAchievement = await userArch.update({
        achieved: true
        }, {
        where: { id_user: userId, id_achievement: achievementId }
    });

    return {message: 'Achievement unlocked', achievement: newAchievement};
  } catch (error) {
    throw new Error(`Error desbloqueando logro (Usuario ${userId}, Logro ${achievementId}): ${error.message}`);
  }
}

//Exportamos las funciones para poder usarlas en el controller
module.exports = {
  getAchievements,
  getUnachievedAchievements,
  unlockAchievement
};

