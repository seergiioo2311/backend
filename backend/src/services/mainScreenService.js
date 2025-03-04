const User = require('../models/User');

async function getUsernameById(userId) {
    const user = await User.findByPk(userId, {
        attributes: ['name'] // Selecciona solo el campo 'name'
    });
    return user ? user.name : null; // Retorna solo el nombre o null si no existe
}

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
