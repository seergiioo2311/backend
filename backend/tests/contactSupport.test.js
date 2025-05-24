// Pruebas para las rutas de Soporte de Contacto (contactSupportRoutes.js)

const request = require('supertest');
const express = require('express');
const contactSupportRoutes = require('../src/routes/contactSupportRoutes');
const contactSupportService = require('../src/services/contactSupportService'); 
const User = require('../src/models/User'); // Para mockear User.findOne
const sgMail = require('@sendgrid/mail'); 

jest.mock('../src/services/contactSupportService'); 
jest.mock('../src/models/User'); // Mockear el modelo User
jest.mock('@sendgrid/mail', () => ({ 
    setApiKey: jest.fn(),
    send: jest.fn().mockResolvedValue([{}, {}]), 
}));

const app = express();
app.use(express.json()); 
app.use('/contact-support', contactSupportRoutes); 

describe('Pruebas de API para Soporte de Contacto', () => {

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    // --- POST /new ---
    describe('POST /contact-support/new', () => {
        const mockMessageData = {
            title: "Problema con la cuenta",
            email: "usuario@ejemplo.com",
            name: "Usuario Ejemplo",
            description: "No puedo acceder a mi cuenta.",
            type: "Technical Support"
        };
        const mockCreatedMessage = { id: 1, ...mockMessageData, resolved: false, response: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

        it('debería crear un nuevo mensaje de soporte y devolver 201', async () => {
            contactSupportService.newMessage.mockResolvedValue(mockCreatedMessage);
            const res = await request(app).post('/contact-support/new').send(mockMessageData);
            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual(mockCreatedMessage);
        });

        it('debería devolver 404 si el servicio no puede crear el mensaje (devuelve null)', async () => {
            contactSupportService.newMessage.mockResolvedValue(null);
            const res = await request(app).post('/contact-support/new').send(mockMessageData);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', "Error creando el mensaje");
        });

        it('debería devolver 500 si el servicio lanza un error inesperado', async () => {
            contactSupportService.newMessage.mockRejectedValue(new Error("Error inesperado del servicio"));
            const res = await request(app).post('/contact-support/new').send(mockMessageData);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', "Error inesperado del servicio");
        });
    });

    // --- GET /all ---
    describe('GET /contact-support/all', () => {
        const mockMessages = [
            { id: 1, title: "Consulta 1", createdAt: new Date().toISOString() },
            { id: 2, title: "Problema 2", createdAt: new Date().toISOString() }
        ];

        it('debería devolver todos los mensajes y estado 200', async () => {
            contactSupportService.getAllMessages.mockResolvedValue(mockMessages);
            const res = await request(app).get('/contact-support/all');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockMessages);
        });

        it('debería devolver 404 si el servicio devuelve null', async () => {
            contactSupportService.getAllMessages.mockResolvedValue(null); 
            const res = await request(app).get('/contact-support/all');
            expect(res.statusCode).toEqual(404);
        });
        
        it('debería devolver 200 con array vacío si el servicio devuelve array vacío', async () => {
            contactSupportService.getAllMessages.mockResolvedValue([]); 
            const res = await request(app).get('/contact-support/all');
            expect(res.statusCode).toEqual(200); 
            expect(res.body).toEqual([]);
        });

        it('debería devolver 500 si el servicio lanza un error', async () => {
            contactSupportService.getAllMessages.mockRejectedValue(new Error("Fallo de servidor"));
            const res = await request(app).get('/contact-support/all');
            expect(res.statusCode).toEqual(500);
        });
    });

    // --- GET /getMessageById/:id ---
    describe('GET /contact-support/getMessageById/:id', () => {
        const messageId = '123';
        const mockMessage = { id: messageId, title: "Mensaje Específico", createdAt: new Date().toISOString() };

        it('debería devolver un mensaje específico y estado 200', async () => {
            contactSupportService.getMesageById.mockResolvedValue(mockMessage);
            const res = await request(app).get(`/contact-support/getMessageById/${messageId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockMessage);
        });

        it('debería devolver 404 si el servicio devuelve null', async () => {
            contactSupportService.getMesageById.mockResolvedValue(null);
            const res = await request(app).get(`/contact-support/getMessageById/${messageId}`);
            expect(res.statusCode).toEqual(404);
        });

        it('debería devolver 500 si el servicio lanza un error', async () => {
            contactSupportService.getMesageById.mockRejectedValue(new Error("Error BD"));
            const res = await request(app).get(`/contact-support/getMessageById/${messageId}`);
            expect(res.statusCode).toEqual(500);
        });
    });

    // --- POST /response/:id ---
    describe('POST /contact-support/response/:id', () => {
        const messageId = 'msg1';
        const responseText = "Respuesta del admin.";
        const originalMessage = { id: messageId, email: 'user@example.com', name: 'Test', description: 'Ayuda!' };
        const updatedMessage = { ...originalMessage, resolved: true, response: responseText };

        it('debería enviar respuesta, actualizar mensaje y devolver 200', async () => {
            contactSupportService.getMesageById.mockResolvedValue(originalMessage);
            sgMail.send.mockResolvedValue([{}, {}]);
            contactSupportService.responseMessage.mockResolvedValue(updatedMessage);
            const res = await request(app).post(`/contact-support/response/${messageId}`).send({ response: responseText });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(updatedMessage);
        });

        it('debería devolver 400 si no hay texto de respuesta', async () => {
            const res = await request(app).post(`/contact-support/response/${messageId}`).send({});
            expect(res.statusCode).toEqual(400);
        });
        
        it('debería devolver 404 si responseMessage del servicio devuelve null', async () => {
            contactSupportService.getMesageById.mockResolvedValue(originalMessage);
            sgMail.send.mockResolvedValue([{}, {}]);
            contactSupportService.responseMessage.mockResolvedValue(null);
            const res = await request(app).post(`/contact-support/response/${messageId}`).send({ response: responseText });
            expect(res.statusCode).toEqual(404);
        });
        
        it('debería devolver 500 si falla el envío del email', async () => {
            contactSupportService.getMesageById.mockResolvedValue(originalMessage);
            sgMail.send.mockRejectedValue(new Error("Fallo al enviar email"));
            const res = await request(app).post(`/contact-support/response/${messageId}`).send({ response: responseText });
            expect(res.statusCode).toEqual(500);
        });

        it('debería devolver 500 si responseMessage del servicio lanza un error', async () => {
            contactSupportService.getMesageById.mockResolvedValue(originalMessage);
            sgMail.send.mockResolvedValue([{}, {}]);
            contactSupportService.responseMessage.mockRejectedValue(new Error("Error DB update"));
            const res = await request(app).post(`/contact-support/response/${messageId}`).send({ response: responseText });
            expect(res.statusCode).toEqual(500);
        });
    });

    // --- GET /unresolved, /resolved, /type/:type ---
    describe('GET /contact-support/unresolved', () => {
        const mockUnresolvedMessages = [ { id: 3, title: "Sin resolver", resolved: false, createdAt: new Date().toISOString() } ];
        it('debería devolver mensajes no resueltos y estado 200', async () => {
            contactSupportService.getMessagesUnresolved.mockResolvedValue(mockUnresolvedMessages);
            const res = await request(app).get('/contact-support/unresolved');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockUnresolvedMessages);
        });
         it('debería devolver 404 si el servicio devuelve null', async () => {
            contactSupportService.getMessagesUnresolved.mockResolvedValue(null);
            const res = await request(app).get('/contact-support/unresolved');
            expect(res.statusCode).toEqual(404);
        });
        it('debería devolver 200 con array vacío si el servicio devuelve array vacío', async () => {
            contactSupportService.getMessagesUnresolved.mockResolvedValue([]);
            const res = await request(app).get('/contact-support/unresolved');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });
        it('debería devolver 500 si el servicio lanza un error', async () => {
            contactSupportService.getMessagesUnresolved.mockRejectedValue(new Error("Error de servidor"));
            const res = await request(app).get('/contact-support/unresolved');
            expect(res.statusCode).toEqual(500);
        });
    });

    describe('GET /contact-support/resolved', () => {
        const mockResolvedMessages = [ { id: 4, title: "Resuelto", resolved: true, createdAt: new Date().toISOString() } ];
        it('debería devolver mensajes resueltos y estado 200', async () => {
            contactSupportService.getMessagesResolved.mockResolvedValue(mockResolvedMessages);
            const res = await request(app).get('/contact-support/resolved');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockResolvedMessages);
        });
        it('debería devolver 404 si el servicio devuelve null', async () => {
            contactSupportService.getMessagesResolved.mockResolvedValue(null);
            const res = await request(app).get('/contact-support/resolved');
            expect(res.statusCode).toEqual(404);
        });
        it('debería devolver 200 con array vacío si el servicio devuelve array vacío', async () => {
            contactSupportService.getMessagesResolved.mockResolvedValue([]);
            const res = await request(app).get('/contact-support/resolved');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });
        it('debería devolver 500 si el servicio lanza un error', async () => {
            contactSupportService.getMessagesResolved.mockRejectedValue(new Error("Error interno"));
            const res = await request(app).get('/contact-support/resolved');
            expect(res.statusCode).toEqual(500);
        });
    });

    describe('GET /contact-support/type/:type', () => {
        const messageType = 'Technical';
        const mockMessagesByType = [ { id: 5, title: "Técnico", type: messageType, createdAt: new Date().toISOString() } ];
        it('debería devolver mensajes de un tipo específico y estado 200', async () => {
            contactSupportService.getMessagesByType.mockResolvedValue(mockMessagesByType);
            const res = await request(app).get(`/contact-support/type/${messageType}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockMessagesByType);
        });
        it('debería devolver 404 si el servicio devuelve null para un tipo', async () => {
            contactSupportService.getMessagesByType.mockResolvedValue(null);
            const res = await request(app).get(`/contact-support/type/${messageType}`);
            expect(res.statusCode).toEqual(404);
        });
        it('debería devolver 200 con array vacío si no hay mensajes de ese tipo', async () => {
            contactSupportService.getMessagesByType.mockResolvedValue([]);
            const res = await request(app).get(`/contact-support/type/${messageType}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });
        it('debería devolver 500 si el servicio lanza un error', async () => {
            contactSupportService.getMessagesByType.mockRejectedValue(new Error("Fallo buscando por tipo"));
            const res = await request(app).get(`/contact-support/type/${messageType}`);
            expect(res.statusCode).toEqual(500);
        });
    });

    // --- DELETE /delete/:id ---
    describe('DELETE /contact-support/delete/:id', () => {
        const messageIdToDelete = 'del123';
        const mockDeletedMessage = { id: messageIdToDelete, title: "Mensaje Eliminado" };

        it('debería eliminar un mensaje y devolver 200', async () => {
            contactSupportService.deleteMessage.mockResolvedValue(mockDeletedMessage);
            const res = await request(app).delete(`/contact-support/delete/${messageIdToDelete}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockDeletedMessage);
        });

        it('debería devolver 404 si el mensaje a eliminar no se encuentra', async () => {
            contactSupportService.deleteMessage.mockResolvedValue(null);
            const res = await request(app).delete(`/contact-support/delete/${messageIdToDelete}`);
            expect(res.statusCode).toEqual(404);
        });

        it('debería devolver 500 si el servicio lanza un error', async () => {
            contactSupportService.deleteMessage.mockRejectedValue(new Error("Error en BD al eliminar"));
            const res = await request(app).delete(`/contact-support/delete/${messageIdToDelete}`);
            expect(res.statusCode).toEqual(500);
        });
    });

    // --- POST /delete-user/:id ---
    describe('POST /contact-support/delete-user/:id', () => {
        const userIdToDelete = 'userDel1';
        const requestBody = { motive: "Incumplimiento de normas", email: "user@example.com" };
        const mockUserFound = { id: userIdToDelete, username: "UsuarioAEliminar" };
        const mockServiceResponse = { id: userIdToDelete, username: "UsuarioAEliminar", message: "Usuario eliminado" };

        it('debería eliminar un usuario, enviar email y devolver 200', async () => {
            User.findOne.mockResolvedValue(mockUserFound);
            sgMail.send.mockResolvedValue([{}, {}]);
            contactSupportService.deleteUser.mockResolvedValue(mockServiceResponse);

            const res = await request(app).post(`/contact-support/delete-user/${userIdToDelete}`).send(requestBody);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockServiceResponse);
        });
        
        it('debería devolver 404 si falta el motivo en el body', async () => {
            const res = await request(app).post(`/contact-support/delete-user/${userIdToDelete}`).send({ email: "user@example.com" });
            expect(res.statusCode).toEqual(404); // El controlador devuelve 404 por `!motive`
            expect(res.body).toHaveProperty('message', "Error, motivo no proporcionado");
        });

        it('debería devolver 404 si falta el email en el body', async () => {
            const res = await request(app).post(`/contact-support/delete-user/${userIdToDelete}`).send({ motive: "Incumplimiento" });
            expect(res.statusCode).toEqual(404); // El controlador devuelve 404 por `!email`
            expect(res.body).toHaveProperty('message', "Error, email no proporcionado");
        });

        it('debería devolver 404 si el usuario no se encuentra', async () => {
            User.findOne.mockResolvedValue(null);
            const res = await request(app).post(`/contact-support/delete-user/${userIdToDelete}`).send(requestBody);
            expect(res.statusCode).toEqual(404);
        });

        it('debería devolver 500 si falla el envío del email', async () => {
            User.findOne.mockResolvedValue(mockUserFound);
            sgMail.send.mockRejectedValue(new Error("Fallo SendGrid"));
            const res = await request(app).post(`/contact-support/delete-user/${userIdToDelete}`).send(requestBody);
            expect(res.statusCode).toEqual(500);
        });

        it('debería devolver 404 si el servicio deleteUser devuelve null', async () => {
            User.findOne.mockResolvedValue(mockUserFound);
            sgMail.send.mockResolvedValue([{}, {}]);
            contactSupportService.deleteUser.mockResolvedValue(null); 
            const res = await request(app).post(`/contact-support/delete-user/${userIdToDelete}`).send(requestBody);
            expect(res.statusCode).toEqual(404);
        });

        it('debería devolver 500 si el servicio deleteUser lanza un error', async () => {
            User.findOne.mockResolvedValue(mockUserFound);
            sgMail.send.mockResolvedValue([{}, {}]);
            contactSupportService.deleteUser.mockRejectedValue(new Error("Error de BD al eliminar usuario"));
            const res = await request(app).post(`/contact-support/delete-user/${userIdToDelete}`).send(requestBody);
            expect(res.statusCode).toEqual(500);
        });
    });

    // --- GET /get-users/:username ---
    describe('GET /contact-support/get-users/:username', () => {
        const usernameQuery = 'testuser';
        const mockUsersList = [
            { id: 'usr1', username: 'testuser1', email: 'test1@example.com' },
            { id: 'usr2', username: 'testuser2', email: 'test2@example.com' }
        ];

        it('debería devolver una lista de usuarios y estado 200', async () => {
            contactSupportService.getUsers.mockResolvedValue(mockUsersList);
            const res = await request(app).get(`/contact-support/get-users/${usernameQuery}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockUsersList);
            expect(contactSupportService.getUsers).toHaveBeenCalledWith(usernameQuery);
        });

        it('debería devolver 404 si el servicio getUsers devuelve null', async () => {
            contactSupportService.getUsers.mockResolvedValue(null);
            const res = await request(app).get(`/contact-support/get-users/${usernameQuery}`);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', "Error obteniendo los usuarios");
        });

        it('debería devolver 200 con array vacío si el servicio getUsers devuelve array vacío', async () => {
            contactSupportService.getUsers.mockResolvedValue([]);
            const res = await request(app).get(`/contact-support/get-users/${usernameQuery}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });

        it('debería devolver 500 si el servicio getUsers lanza un error', async () => {
            contactSupportService.getUsers.mockRejectedValue(new Error("Error buscando usuarios"));
            const res = await request(app).get(`/contact-support/get-users/${usernameQuery}`);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', "Error buscando usuarios");
        });
    });

    // --- GET /get-num-users ---
    describe('GET /contact-support/get-num-users', () => {
        it('debería devolver el número de usuarios y estado 200', async () => {
            const numUsers = 42;
            contactSupportService.getNumUsers.mockResolvedValue(numUsers);
            const res = await request(app).get('/contact-support/get-num-users');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(numUsers); // El controlador devuelve el número directamente
            expect(contactSupportService.getNumUsers).toHaveBeenCalledTimes(1);
        });

        it('debería devolver 404 si el servicio getNumUsers devuelve null', async () => {
            contactSupportService.getNumUsers.mockResolvedValue(null); // o undefined, o 0 si el controlador lo trata como error
            const res = await request(app).get('/contact-support/get-num-users');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', "Error obteniendo el número de usuarios");
        });
        
        it('debería devolver 404 si el servicio getNumUsers devuelve 0 (considerando el if !numUsers)', async () => {
            contactSupportService.getNumUsers.mockResolvedValue(0); 
            const res = await request(app).get('/contact-support/get-num-users');
            // El controlador actual tiene `if (!numUsers)`, lo cual es true para 0.
            expect(res.statusCode).toEqual(404); 
            expect(res.body).toHaveProperty('message', "Error obteniendo el número de usuarios");
        });

        it('debería devolver 500 si el servicio getNumUsers lanza un error', async () => {
            contactSupportService.getNumUsers.mockRejectedValue(new Error("Error contando usuarios"));
            const res = await request(app).get('/contact-support/get-num-users');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', "Error contando usuarios");
        });
    });
});

