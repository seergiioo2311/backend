// Pruebas para las rutas de Pantalla Principal (mainScreenRoutes.js)

const request = require('supertest');
const express = require('express');
const mainScreenRoutes = require('../src/routes/mainScreenRoutes');
const mainScreenService = require('../src/services/mainScreenService'); // Para mocks

// Mockear los servicios para evitar llamadas reales a la base de datos
jest.mock('../src/services/mainScreenService');

const app = express();
app.use(express.json()); // Middleware para parsear JSON
app.use('/main-screen', mainScreenRoutes); // Montar las rutas bajo /main-screen

describe('Pruebas de API para Pantalla Principal', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Limpiar mocks después de cada prueba
    });

    describe('GET /main-screen/get-user/:id', () => {
        const userId = 'test-user-id-123';

        it('debería devolver el nombre de usuario y estado 200 si se encuentra el usuario', async () => {
            const mockUsername = 'UsuarioDePrueba';
            mainScreenService.getUsernameById.mockResolvedValue(mockUsername);
            const res = await request(app).get(`/main-screen/get-user/${userId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ username: mockUsername });
        });

        it('debería devolver 404 si el servicio no encuentra el usuario (devuelve null)', async () => {
            mainScreenService.getUsernameById.mockResolvedValue(null);
            const res = await request(app).get(`/main-screen/get-user/${userId}`);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Ususario no encontrado');
        });

        it('debería devolver 500 si el servicio lanza un error inesperado', async () => {
            const errorMessage = 'Error catastrófico del servicio';
            mainScreenService.getUsernameById.mockRejectedValue(new Error(errorMessage));
            const res = await request(app).get(`/main-screen/get-user/${userId}`);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', errorMessage);
        });
    });

    describe('GET /main-screen/get-id/:username', () => {
        const username = 'UsuarioDePrueba123';

        it('debería devolver el ID del usuario y estado 200 si se encuentra el usuario', async () => {
            const mockUserId = 'user-id-abc-987';
            mainScreenService.getIdByUsername.mockResolvedValue(mockUserId);
            const res = await request(app).get(`/main-screen/get-id/${username}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ id: mockUserId });
        });

        it('debería devolver 404 si el servicio no encuentra el usuario (devuelve null)', async () => {
            mainScreenService.getIdByUsername.mockResolvedValue(null);
            const res = await request(app).get(`/main-screen/get-id/${username}`);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Ususario no encontrado');
        });

        it('debería devolver 500 si el servicio lanza un error inesperado', async () => {
            const errorMessage = 'Fallo grave obteniendo ID';
            mainScreenService.getIdByUsername.mockRejectedValue(new Error(errorMessage));
            const res = await request(app).get(`/main-screen/get-id/${username}`);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', errorMessage);
        });
    });
    
    describe('PUT /main-screen/update-connection/:id', () => {
        const userId = 'conn-user-id-456';

        it('debería actualizar la conexión y devolver 200 con el resultado del servicio', async () => {
            const mockServiceResult = { message: 'Usuario actualizado' };
            mainScreenService.getUsernameById.mockResolvedValue('someUsername'); 
            mainScreenService.updateConnection.mockResolvedValue(mockServiceResult);
            const res = await request(app).put(`/main-screen/update-connection/${userId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockServiceResult);
        });
        
        it('debería devolver 200 con mensaje de error si updateConnection devuelve un error específico', async () => {
            const mockErrorMessage = { message: 'Usuario no encontrado en updateConnection' };
            mainScreenService.getUsernameById.mockResolvedValue('someUsername');
            mainScreenService.updateConnection.mockResolvedValue(mockErrorMessage); 
            const res = await request(app).put(`/main-screen/update-connection/${userId}`);
            expect(res.statusCode).toEqual(200); 
            expect(res.body).toEqual(mockErrorMessage);
        });

        it('debería devolver 500 si updateConnection lanza un error inesperado', async () => {
            const errorMessage = 'Error crítico en updateConnection';
            mainScreenService.getUsernameById.mockResolvedValue('someUsername');
            mainScreenService.updateConnection.mockRejectedValue(new Error(errorMessage));
            const res = await request(app).put(`/main-screen/update-connection/${userId}`);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', errorMessage);
        });
    });

    describe('PUT /main-screen/update-user/:id', () => {
        const userId = 'update-user-id-789';
        const newUsername = 'NuevoNombreUsuario';
        const newPassword = 'NuevaContraseña123';

        beforeEach(() => {
            mainScreenService.getUsernameById.mockResolvedValue('UsuarioExistente');
        });

        it('debería actualizar solo el nombre de usuario y devolver 200', async () => {
            const mockServiceResponse = { message: 'OK' };
            mainScreenService.updateUser.mockResolvedValue(mockServiceResponse);
            const res = await request(app).put(`/main-screen/update-user/${userId}`).send({ username: newUsername });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockServiceResponse);
            expect(mainScreenService.updateUser).toHaveBeenCalledWith(userId, newUsername, undefined);
        });

        it('debería actualizar solo la contraseña y devolver 200', async () => {
            const mockServiceResponse = { message: 'OK' };
            mainScreenService.updateUser.mockResolvedValue(mockServiceResponse);
            const res = await request(app).put(`/main-screen/update-user/${userId}`).send({ password: newPassword });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockServiceResponse);
            expect(mainScreenService.updateUser).toHaveBeenCalledWith(userId, undefined, newPassword);
        });

        it('debería actualizar nombre y contraseña, y devolver 200', async () => {
            const mockServiceResponse = { message: 'OK' };
            mainScreenService.updateUser.mockResolvedValue(mockServiceResponse);
            const res = await request(app).put(`/main-screen/update-user/${userId}`).send({ username: newUsername, password: newPassword });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockServiceResponse);
        });
        
        it('debería devolver 500 si el servicio updateUser devuelve un mensaje de error', async () => {
            const serviceErrorMessage = { message: 'El nombre de usuario ya está en uso' };
            mainScreenService.updateUser.mockResolvedValue(serviceErrorMessage);
            const res = await request(app).put(`/main-screen/update-user/${userId}`).send({ username: newUsername });
            expect(res.statusCode).toEqual(500); 
            expect(res.body).toEqual(serviceErrorMessage);
        });
        
        it('debería devolver 500 si el servicio updateUser lanza un error inesperado', async () => {
            const errorMessage = 'Error de base de datos actualizando usuario';
            mainScreenService.updateUser.mockRejectedValue(new Error(errorMessage));
            const res = await request(app).put(`/main-screen/update-user/${userId}`).send({ username: newUsername });
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', errorMessage);
        });
    });

    describe('PUT /main-screen/verify-password/:id', () => {
        const userId = 'verify-pass-id-000';
        const passwordToVerify = 'password123';

        beforeEach(() => {
            // Por defecto, simula que el usuario existe para las pruebas de verifyPassword
            mainScreenService.getUsernameById.mockResolvedValue('UsuarioExistenteParaVerificarPass');
        });

        it('debería verificar la contraseña y devolver 200 si es correcta', async () => {
            const mockServiceResponse = { message: 'OK' };
            mainScreenService.verifyPassword.mockResolvedValue(mockServiceResponse);

            const res = await request(app)
                .put(`/main-screen/verify-password/${userId}`)
                .send({ password: passwordToVerify });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockServiceResponse);
            expect(mainScreenService.verifyPassword).toHaveBeenCalledWith(userId, passwordToVerify);
            expect(mainScreenService.getUsernameById).toHaveBeenCalledWith(userId);
        });

        it('debería devolver 500 si el servicio verifyPassword devuelve un mensaje de error (ej: Contraseña incorrecta)', async () => {
            const serviceErrorMessage = { message: 'Contraseña incorrecta' };
            mainScreenService.verifyPassword.mockResolvedValue(serviceErrorMessage);

            const res = await request(app)
                .put(`/main-screen/verify-password/${userId}`)
                .send({ password: passwordToVerify });

            expect(res.statusCode).toEqual(500); // El controlador convierte esto en 500
            expect(res.body).toEqual(serviceErrorMessage);
        });
        
        it('debería devolver 500 si el servicio verifyPassword devuelve un mensaje de error (ej: Loggin no encontrado)', async () => {
            const serviceErrorMessage = { message: 'Loggin no encontrado' };
            mainScreenService.verifyPassword.mockResolvedValue(serviceErrorMessage);
        
            const res = await request(app)
                .put(`/main-screen/verify-password/${userId}`)
                .send({ password: passwordToVerify });
        
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(serviceErrorMessage);
        });
        
        it('debería devolver 500 si el servicio verifyPassword devuelve un mensaje de error (ej: Se requiere userId y password)', async () => {
            // Este caso es interesante. El controlador no valida el body.password, pero el servicio sí.
            const serviceErrorMessage = { message: 'Se requiere userId y password' };
            mainScreenService.verifyPassword.mockResolvedValue(serviceErrorMessage); // Simula que el servicio devuelve este error
        
            const res = await request(app)
                .put(`/main-screen/verify-password/${userId}`)
                .send({ }); // Enviando body vacío
        
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(serviceErrorMessage);
            // El servicio es llamado con (userId, undefined)
            expect(mainScreenService.verifyPassword).toHaveBeenCalledWith(userId, undefined); 
        });

        it('debería devolver 500 si el servicio verifyPassword lanza un error inesperado', async () => {
            const errorMessage = 'Error de base de datos verificando contraseña';
            mainScreenService.verifyPassword.mockRejectedValue(new Error(errorMessage));

            const res = await request(app)
                .put(`/main-screen/verify-password/${userId}`)
                .send({ password: passwordToVerify });

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', errorMessage);
        });
    });
});

