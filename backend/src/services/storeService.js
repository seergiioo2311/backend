const User = require('../models/User');
const { Item } = require('../models/Item');
const UserItem = require('../models/User_item');
const { validate, version } = require('uuid');

/**
  * @description Asigna un item a un usuario.
  * @param {UUID} userId - ID del usuario.
  * @param {number} itemId - ID del item.
  * @returns {Promise<UserItem>} - Promesa con el item asignado.
  * @throws {Error} - Error en caso de que el usuario o el item no existan.
  */
async function assignItem(userId, itemId) {
    try {
        const user = await User.findByPk(userId);
        const item = await Item.findByPk(itemId);
        
        if (!user || !item) {
            throw new Error('Usuario o item no encontrado');
        }
        const userItem = await UserItem.create({ id_user: userId, id_item: itemId });
        return userItem;
    } catch (error) {
        throw error;
    }
}

/**
  * @description Obtiene todos los items de un usuario. 
  * @param {UUID} userId - ID del usuario.
  * @returns {Promise<UserItem[]>} - Promesa con todos los items del usuario.
  * @throws {Error} - Error en caso de que el usuario no exista.
  */ 
async function getAllItems(user_id) {
    try {
        /*
        if (!validate(user_id) || version(user_id) !== 4) {
            console.log("ID de usuario inválido");
            throw new Error('ID de usuario inválido');
        }
        */
        const user = await User.findByPk(user_id);
        if (!user) {
            console.log("Usuario no encontrado");
            throw new Error('Usuario no encontrado');
        }
        console.log("Buscando los items del usuario");
        const userItems = await UserItem.findAll({where: { id_user: user_id }});
        
        // Si no hay items asignados
        if (userItems.length === 0) {
            console.log("No hay items asignados al usuario");
            return [];  // Retornar un array vacío si no tiene items
        }

        // Obtener los item_ids de los registros de UserItem
        const itemIds = userItems.map(userItem => userItem.id_item);

        // Buscar todos los items usando los item_ids
        const items = await Item.findAll({
            where: {
                id: itemIds
            }
        });

        return items;
    }
    catch (error) {
        throw error;
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

/**
 * @description Comprueba si un item esta registrado en la base de datos
 * @param {number} userId - El id del item
 * @returns {Json} - Un objeto con un mensaje de éxito o error
 * @throws {Error} - Si no se encuentra
 */ 
async function checkItem(itemId) {
    const item = await Item.findOne({
      where: {id: itemId}
    });
  
    if(item) {
      return {message: "Item encontrado"};
    }
    else {
      return {message: "Item no encontrado"};
    }
}

module.exports = { assignItem, getAllItems, checkUser, checkItem };
