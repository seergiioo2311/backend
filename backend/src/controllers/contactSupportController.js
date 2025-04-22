const contactSupportService = require('../services/contactSupportService');
const User = require('../models/User');
const transporter = require('../config/nodemailerConfig');
const path = require('path');

const newMessage = async (req, res) => {
    try {
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

        const mail = await transporter.sendMail({
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

            </body>
            </html>
            `, 
            attachments: [
                {
                    filename: 'logo.png',
                    path: path.join(__dirname, '../assets/logo.png'),
                    cid: 'logo',
                }
            ]
        });

        message = await contactSupportService.responseMessage(id, response);
        if (!message) {
            return res.status(404).json({ message: "Error resolviendo el mensaje" });
        }
        else {
            res.status(200).json(message);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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
        if (!id) {
            return res.status(404).json({ message: "Error, id no proporcionado" });
        }

        const user = await User.findOne({ where: { id: id } });
        if (!user) {
            return res.status(404).json({ message: "Error, usuario no encontrado" });
        }

        const mail = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: message.email,
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
                            Si crees que esto es un error, por favor contacta con el soporte.<br>
                            <br><br>
                            Si tienes alguna otra pregunta o necesitas más información, no dudes en contactarnos nuevamente.
                        </p>

            </body>
            </html>
            `, 
            attachments: [
                {
                    filename: 'logo.png',
                    path: path.join(__dirname, '../assets/logo.png'),
                    cid: 'logo',
                }
            ]
        });


        const res = await contactSupportService.deleteUser(id);
        if (!res) {
            return res.status(404).json({ message: "Error eliminando el usuario" });
        }
        else {
            res.status(200).json(res);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { newMessage, getAllMessages, getMesageById, reponseMessage, getMessagesUnresolved, getMessagesResolved, getMessagesByType, deleteMessage };
