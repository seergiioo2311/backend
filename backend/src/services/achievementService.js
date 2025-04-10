const {Achievement, AchievementType} = require('../models/Achievement.js');
const userArch = require('../models/User_achievement.js');
const { Op } = require('sequelize');
const User = require("../models/User.js");

/** 
 * @description Obtiene los logros de un usuario
 * @param {number} userId - El id del usuario
 * @returns {Json} - Un objeto con los logros del usuario
 */
async function getAchievements(userId) {
  try {
    console.log(`🔍 Iniciando obtención de logros para usuario ID: ${userId}`);

    const userAchievements = await userArch.findAll({
      where: { id_user: userId },
      attributes: ['id_achievement', 'achieved', 'completed', 'current_value'],
      raw: true
    });
    console.log(`✅ Logros encontrados en User_achievement:`, userAchievements);

    if (userAchievements.length === 0) {
      console.log('⚠️ No se encontraron logros para el usuario. Retornando []');
      return [];
    }

    const achievementIds = [...new Set(userAchievements.map(ua => ua.id_achievement))];
    console.log(`🆔 IDs únicos de logros encontrados:`, achievementIds);

    const achievements = await Achievement.findAll({
      where: { id: achievementIds },
      raw: true
    });
    console.log(`📄 Detalles de logros obtenidos desde la tabla 'ach':`, achievements);

    const achievementsWithDetails = achievements.map(achievement => {
      const userAchievement = userAchievements.find(
        ua => ua.id_achievement === achievement.id
      );
      return {
        ...achievement,
        achieved: userAchievement.achieved,
        completed: userAchievement.completed,
        current_value: userAchievement.current_value
      };
    });

    console.log(`🎯 Logros combinados con detalles del usuario:`, achievementsWithDetails);

    const notClaimedCompleted = achievementsWithDetails
      .filter(l => l.completed && !l.achieved)
      .sort((a, b) => a.objective_value - b.objective_value);

    const inProgress = achievementsWithDetails
      .filter(l => !l.completed)
      .sort((a, b) => a.objective_value - b.objective_value);

    const claimed = achievementsWithDetails
      .filter(l => l.completed && l.achieved)
      .sort((a, b) => a.objective_value - b.objective_value);

    const sortedAchievements = [
      ...notClaimedCompleted,
      ...inProgress,
      ...claimed
    ];

    return { achievements: sortedAchievements };

  } catch (error) {
    console.error(`❌ Error obteniendo logros (Usuario ${userId}): ${error.message}`);
    throw new Error(`Error obteniendo logros (Usuario ${userId}): ${error.message}`);
  }
}


/**
* @description Desbloquea un logro de un usuario y actualiza la experiencia del usuario
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

    // Obtener el logro para conocer la experiencia que otorga
    const achievement = await Achievement.findOne({
      where: { id: achievementId },
      attributes: ['experience_otorgued'] // Asegúrate de que la tabla tenga este campo
    });

    if (!achievement) {
      throw new Error('Achievement not found');
    }

    // Crear nuevo registro de logro desbloqueado
    const newAchievement = await userArch.update({
        achieved: true
        }, {
        where: { id_user: userId, id_achievement: achievementId }
    });

    // Actualizar la experiencia del usuario
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    user.experience += achievement.experience_otorgued; // Sumar la experiencia del logro al usuario
    await user.save();

    return {message: 'Achievement unlocked', achievement: newAchievement};
  } catch (error) {
    throw new Error(`Error desbloqueando logro (Usuario ${userId}, Logro ${achievementId}): ${error.message}`);
  }
}

/**
* @description Actualiza los logros de un tipo
* @param {number} userId - El id del usuario
* @param {achType} achivementType - El tipo del logro
* @param {number} quantity - Cantidad del logro a sumar
* @throws {Error} - Maneja errores internos del servidor
*/
async function updateAchievement(userId, achivementType, quantity) {
  try {
    // Buscar todos los logros del tipo dado
    const achievements = await Achievement.findAll({
      where: { type: achivementType }
    });

    for (const achievement of achievements) {
      // Verificar si el usuario ya tiene este logro
      let userAchievement = await userArch.findOne({
        where: {
          id_user: userId,
          id_achievement: achievement.id
        }
      });

      if (userAchievement) {
        console.log("logro encontrado")
        if (achivementType == "maxScore") {
          userAchievement.current_value =  Math.max(userAchievement.current_value, quantity);
          await userAchievement.save();
        } else {
          // Si existe, sumar el progreso
          userAchievement.current_value += quantity;
          await userAchievement.save();
        }
      }
    }
    return { message: "Logro actualizado correctamente." };
  } catch (error) {
    console.error("Error updating achievement:", error);
    throw new Error("Internal server error while updating achievements.");
  }
}

/**
 * @description Comprueba si un usuario esta registrado en la base de datos
 * @param {number} userId - El id del usuario
 * @returns {Json} - Un objeto con un mensaje de éxito o error
 * @throws {Error} - Si no se encuentra
 */ 
async function checkUser(userId) {
  const user = await User.findOne({
    where: {id: userId}
  });

  if(user) {
    return {message: "Usuario encontrado"};
  }
  else {
    return {message: "Usuario no encontrado"};
  }
}

//Exportamos las funciones para poder usarlas en el controller
module.exports = {
  getAchievements,
  unlockAchievement,
  updateAchievement,
  checkUser
};

