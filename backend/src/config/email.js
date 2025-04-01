const nodemailer = require('nodemailer');
require('dotenv').config();

//Configuración del transporter del correo electronico
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
});

module.exports = transporter;
