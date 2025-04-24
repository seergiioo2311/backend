const { ContactSupport, TYPE_ISSUE } = require('../models/contactSupport');
const { Op } = require('sequelize');
const axios = require('axios');
const { Json } = require('sequelize/lib/utils');
const User = require('../models/User');
const Logging = require('../models/Loggin');


async function newMessage(title, email, name, description, type) {
    try {
        const newMessage = await ContactSupport.create({
            title: title,
            email: email,
            name: name,
            description: description,
            type: type
        });
        return newMessage;
    } catch (error) {
        console.error(error);
        throw new Error(`Error creando mensaje: ${error.message}`);
    }
}

async function getAllMessages() {
    try {
        const messages = await ContactSupport.findAll({
            order: [['createdAt', 'DESC']]
        });
        return messages;
    } catch (error) {
        console.error(error);
        throw new Error(`Error obteniendo mensajes: ${error.message}`);
    }
}

async function getMesageById(id) {
    try {
        const message = await ContactSupport.findOne({
            where: { id: id }
        });
        return message;
    } catch (error) {
        console.error(error);
        throw new Error(`Error obteniendo mensaje: ${error.message}`);
    }
}

async function responseMessage(id, response) {
    try {
        const message = await ContactSupport.findOne({
            where: { id: id }
        });

        if (!message) {
            throw new Error('Mensaje no encontrado');
        }

        message.resolved = true;
        message.response = response;
        await message.save();

        return message;
    } catch (error) {
        console.error(error);
        throw new Error(`Error resolviendo mensaje: ${error.message}`);
    }
}

async function getMessagesUnresolved() {
    try {
        const messages = await ContactSupport.findAll({
            where: {
                resolved: false
            },
            order: [['createdAt', 'DESC']]
        });
        return messages;
    } catch (error) {
        throw new Error(`Error obteniendo mensajes no resueltos: ${error.message}`);
    }
}

async function getMessagesResolved() {
    try {
        const messages = await ContactSupport.findAll({
            where: {
                resolved: true
            },
            order: [['createdAt', 'DESC']]
        });
        return messages;
    } catch (error) {
        throw new Error(`Error obteniendo mensajes resueltos: ${error.message}`);
    }
}

async function getMessagesByType(type) {
    try {
        const messages = await ContactSupport.findAll({
            where: {
                type: type
            },
            order: [['createdAt', 'DESC']]
        });
        return messages;
    } catch (error) {
        throw new Error(`Error obteniendo mensajes por tipo: ${error.message}`);
    }
}

async function deleteMessage(id) {
    try {
        const message = await ContactSupport.findOne({
            where: { id: id }
        });

        if (!message) {
            throw new Error('Mensaje no encontrado');
        }

        await message.destroy();
        return message;
    } catch (error) {
        console.error(error);
        throw new Error(`Error eliminando mensaje: ${error.message}`);
    }
}

async function deleteUser(userId) {
    try {
        console.log(`Eliminando usuario con ID: ${userId}`);
        const user = await User.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        await user.destroy();
        console.log(`Usuario ${user.username} eliminado`);

        return user;
    } catch (error) {
        throw new Error(`Error eliminando usuario: ${error.message}`);
    }
}

/**
 * @description Obtiene todos los usuarios que su username contengan el texto introducido
 * @param {string} username - El texto a buscar en el username
 * @returns {Response} - Devuelve los usuarios encontrados
 * @throws {Error} - Maneja errores internos del servidor
 */
async function getUsers(username) {
    try {
        const users = await User.findAll({
            where: {
                username: {
                    [Op.like]: `%${username}%`
                }
            },
            order: [['createdAt', 'DESC']]
        });

        // Añadir el email desde la tabla Logging
        const usersWithEmail = await Promise.all(
            users.map(async (user) => {
                const logging = await Logging.findOne({
                    where: { username: user.username }, // Suponiendo que Logging tiene una columna user_id
                    attributes: ['email']
                });

                return {
                    ...user.toJSON(),
                    email: logging ? logging.email : null // Añadir email o null si no existe
                };
            })
        );

        return usersWithEmail;
    } catch (error) {
        console.error(error);
        throw new Error(`Error obteniendo usuarios: ${error.message}`);
    }
}

/**
 * @description Obtiene el número total de usuarios registrados
 * @returns {Response} - Devuelve el número total de usuarios	
 * @throws {Error} - Maneja errores internos del servidor
 */
async function getNumUsers() {
    try {
        const numUsers = await User.count();
        return numUsers;
    } catch (error) {
        console.error(error);
        throw new Error(`Error obteniendo el número de usuarios: ${error.message}`);
    }
}

module.exports = { newMessage, getAllMessages, getMesageById, responseMessage, getMessagesUnresolved, getMessagesResolved, getMessagesByType, deleteMessage, deleteUser, getUsers, getNumUsers };