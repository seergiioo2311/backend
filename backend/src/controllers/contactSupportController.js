const contactSupportService = require('../services/contactSupportService');
const User = require('../models/User');
//const transporter = require('../config/email.js');
const path = require('path');

const sgMail = require('@sendgrid/mail');
const fs = require('fs');

// Configura tu API key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const newMessage = async (req, res) => {
    try {
        console.log("Nuevo mensaje recibido:", req.body); // Mensaje de depuración
        const { title, email, name, description, type } = req.body;
        const message = await contactSupportService.newMessage(title, email, name, description, type);
        if (!message) {
            return res.status(404).json({ message: "Error creando el mensaje" });
        }
        else {
            res.status(201).json(message);
        }
        } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllMessages = async (req, res) => {
    try {
        const messages = await contactSupportService.getAllMessages();
        if (!messages) {
            return res.status(404).json({ message: "Error obteniendo los mensajes" });
        }
        else {
            res.status(200).json(messages);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMesageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await contactSupportService.getMesageById(id);
        if (!message) {
            return res.status(404).json({ message: "Error obteniendo el mensaje" });
        }
        else {
            res.status(200).json(message);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const reponseMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;
        
        if (!id) {
            return res.status(400).json({ message: "Error, id no proporcionado" });
        }
        
        if (!response) {
            return res.status(400).json({ message: "Error, respuesta no proporcionada" });
        }
        
        message = await contactSupportService.getMesageById(id);
        
        // Leer la imagen del logo para el adjunto
        const logoPath = path.join(__dirname, '../assets/logo.png');
        const logoContent = fs.readFileSync(logoPath).toString('base64');
        
        const msg = {
            from: process.env.EMAIL_USER,
            to: message.email,
            subject: 'Respuesta a tu mensaje',
            html: `
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #1a1a2e; margin: 0; padding: 0;
                         background-image: url('https://source.unsplash.com/600x400/?galaxy,stars');
                         background-size: cover; background-position: center;">
                
                <div style="max-width: 600px; margin: 30px auto; background: rgba(40, 40, 80, 0.9); padding: 20px;
                             border-radius: 8px; box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3); text-align: center;
                             color: #ddd;">
                    
                    <!-- Logo -->
                    <img src="cid:logo" alt="Logo" style="max-width: 150px; margin-bottom: 20px; filter: drop-shadow(0px 0px 5px rgba(255, 255, 255, 0.8));">
                    
                    <h1 style="color: #b19cd9; font-size: 24px;">Respuesta del equipo de soporte</h1>
                    <p style="color: #c0c0ff; font-size: 16px;">
                        Buenos días, ${message.name}.<br>
                        Gracias por ponerte en contacto con nosotros. Hemos recibido tu mensaje y queremos informarte que hemos respondido a tu consulta.
                        <br><br>
                        <strong>Tu mensaje:</strong><br>
                        ${message.description}
                        <br><br>
                        <strong>Nuestra respuesta:</strong><br>
                        ${response}
                        <br><br>
                        Si tienes alguna otra pregunta o necesitas más información, no dudes en contactarnos nuevamente.
                    </p>
                </div>
            </body>
            </html>
            `,
            attachments: [
                {
                    content: logoContent,
                    filename: 'logo.png',
                    type: 'image/png',
                    disposition: 'inline',
                    content_id: 'logo'
                }
            ]
        };
        
        await sgMail.send(msg);
        
        message = await contactSupportService.responseMessage(id, response);
        if (!message) {
            return res.status(404).json({ message: "Error resolviendo el mensaje" });
        }
        else {
            res.status(200).json(message);
        }
    } catch (error) {
        console.error('Error en reponseMessage:', error);
        if (error.response) {
            console.error(error.response.body);
        }
        res.status(500).json({ message: error.message });
    }
};

const getMessagesUnresolved = async (req, res) => {
    try {
        const messages = await contactSupportService.getMessagesUnresolved();
        if (!messages) {
            return res.status(404).json({ message: "Error obteniendo los mensajes" });
        }
        else {
            res.status(200).json(messages);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMessagesResolved = async (req, res) => {
    try {
        const messages = await contactSupportService.getMessagesResolved();
        if (!messages) {
            return res.status(404).json({ message: "Error obteniendo los mensajes" });
        }
        else {
            res.status(200).json(messages);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMessagesByType = async (req, res) => {
    try {
        const { type } = req.params;
        const messages = await contactSupportService.getMessagesByType(type);
        if (!messages) {
            return res.status(404).json({ message: "Error obteniendo los mensajes" });
        }
        else {
            res.status(200).json(messages);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await contactSupportService.deleteMessage(id);
        if (!message) {
            return res.status(404).json({ message: "Error eliminando el mensaje" });
        }
        else {
            res.status(200).json(message);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
} 

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { motive } = req.body;
        const { email } = req.body;
        
        console.log("Nuevo mensaje recibido:", motive, id); // Mensaje de depuración
        
        if (!id) {
            return res.status(404).json({ message: "Error, id no proporcionado" });
        }
        if (!motive) {
            return res.status(404).json({ message: "Error, motivo no proporcionado" });
        }
        if (!email) {
            return res.status(404).json({ message: "Error, email no proporcionado" });
        }
        
        const user = await User.findOne({ where: { id: id } });
        if (!user) {
            return res.status(404).json({ message: "Error, usuario no encontrado" });
        }
        
        console.log("hasta el mail todo bie");
        
        // Leer la imagen del logo para el adjunto
        const logoPath = path.join(__dirname, '../assets/logo.png');
        const logoContent = fs.readFileSync(logoPath).toString('base64');
        
        const msg = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Eliminación de la cuenta',
            html: `
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #1a1a2e; margin: 0; padding: 0;
                         background-image: url('https://source.unsplash.com/600x400/?galaxy,stars');
                         background-size: cover; background-position: center;">
                
                <div style="max-width: 600px; margin: 30px auto; background: rgba(40, 40, 80, 0.9); padding: 20px;
                             border-radius: 8px; box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3); text-align: center;
                             color: #ddd;">
                    
                    <!-- Logo -->
                    <img src="cid:logo" alt="Logo" style="max-width: 150px; margin-bottom: 20px; filter: drop-shadow(0px 0px 5px rgba(255, 255, 255, 0.8));">
                    
                    <h1 style="color: #b19cd9; font-size: 24px;">Eliminación de la cuenta</h1>
                    <p style="color: #c0c0ff; font-size: 16px;">
                        Buenos días, ${user.username}.<br>
                        Lamentamos informarte que tu cuenta ha sido baneada y por tanto eliminada.<br>
                        El motivo de la eliminación es el siguiente:<br>
                        <strong>${motive}</strong><br>
                        Si crees que esto es un error, por favor contacta con el soporte.<br>
                        <br><br>
                        Si tienes alguna otra pregunta o necesitas más información, no dudes en contactarnos nuevamente.
                    </p>
                </div>
            </body>
            </html>
            `,
            attachments: [
                {
                    content: logoContent,
                    filename: 'logo.png',
                    type: 'image/png',
                    disposition: 'inline',
                    content_id: 'logo'
                }
            ]
        };
        
        await sgMail.send(msg);
        
        console.log("ID del usuario a eliminar:", id); // Mensaje de depuración
        
        const resp = await contactSupportService.deleteUser(id);
        if (!resp) {
            console.log("Error eliminando el usuario"); // Mensaje de depuración
            return res.status(404).json({ message: "Error eliminando el usuario" });
        }
        else {
            console.log("Usuario eliminado correctamente"); // Mensaje de depuración
            res.status(200).json(resp);
        }
    } catch (error) {
        console.error('Error en deleteUser:', error);
        if (error.response) {
            console.error(error.response.body);
        }
        res.status(500).json({ message: error.message });
    }
};

/**
 * @description Obtiener todos los usuarios que empiecen por el nombre de usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve todos los usuarios que su username empiece por el nombre de usuario
 * @throws {Error} - Maneja errores internos del servidor
 */
const getUsers = async (req, res) => {
    try {
        const { username } = req.params;
        const users = await contactSupportService.getUsers(username);
        if (!users) {
            return res.status(404).json({ message: "Error obteniendo los usuarios" });
        }
        else {
            res.status(200).json(users);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Obtiener el número total de usuarios registrados
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve el número total de usuarios registrados
 * @throws {Error} - Maneja errores internos del servidor
 */
const getNumUsers = async (req, res) => {
    try {
        const numUsers = await contactSupportService.getNumUsers();
        if (!numUsers) {
            return res.status(404).json({ message: "Error obteniendo el número de usuarios" });
        }
        else {
            console.log("Número de usuarios:", numUsers); // Mensaje de depuración
            res.status(200).json(numUsers);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { newMessage, getAllMessages, getMesageById, reponseMessage, getMessagesUnresolved, getMessagesResolved, getMessagesByType, deleteMessage, deleteUser, getUsers, getNumUsers };
