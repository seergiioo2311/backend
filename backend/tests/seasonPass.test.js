// Pruebas para las rutas de Pase de Temporada (seasonPassRoutes.js)

const request = require('supertest');
const express = require('express');
const seasonPassRoutes = require('../src/routes/seasonPassRoutes');
const seasonPassService = require('../src/services/seasonPassService'); // Para mocks

// Mockear los servicios para evitar llamadas reales a la base de datos
jest.mock('../src/services/seasonPassService');

const app = express();
app.use(express.json()); // Middleware para parsear JSON
app.use('/', seasonPassRoutes); 

describe('Pruebas de API para Pase de Temporada', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Limpiar mocks después de cada prueba
    });

    describe('GET /season-pass/getItemsFromSeasonPass/:idUser/:idSeasonPass', () => {
        const idUser = 'user123';
        const idSeasonPass = 'sp456';
        const mockItems = [
            { level_required: 1, unlocked: true, reclaimed: false, id: 'itemA', name: 'Item A', type: 'Skin' },
        ];

        it('debería devolver los ítems del pase de temporada y estado 200', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" }); 
            seasonPassService.checkSeasonPass.mockResolvedValue({ message: "Pase de temporada encontrado" }); 
            seasonPassService.getItemsFromSeasonPass.mockResolvedValue(mockItems);
            const res = await request(app).get(`/season-pass/getItemsFromSeasonPass/${idUser}/${idSeasonPass}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockItems);
        });

        it('debería devolver 404 si el usuario no se encuentra', async () => {
            seasonPassService.checkUser.mockResolvedValue(null); 
            const res = await request(app).get(`/season-pass/getItemsFromSeasonPass/${idUser}/${idSeasonPass}`);
            expect(res.statusCode).toEqual(404);
        });

        it('debería devolver 404 si el pase de temporada no se encuentra', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.checkSeasonPass.mockResolvedValue(null); 
            const res = await request(app).get(`/season-pass/getItemsFromSeasonPass/${idUser}/${idSeasonPass}`);
            expect(res.statusCode).toEqual(404);
        });

        it('debería devolver 404 si no se encuentran ítems (servicio devuelve null)', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.checkSeasonPass.mockResolvedValue({ message: "Pase de temporada encontrado" });
            seasonPassService.getItemsFromSeasonPass.mockResolvedValue(null);
            const res = await request(app).get(`/season-pass/getItemsFromSeasonPass/${idUser}/${idSeasonPass}`);
            expect(res.statusCode).toEqual(404);
        });
        
        it('debería devolver 200 con array vacío si no se encuentran ítems (servicio devuelve array vacío)', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.checkSeasonPass.mockResolvedValue({ message: "Pase de temporada encontrado" });
            seasonPassService.getItemsFromSeasonPass.mockResolvedValue([]); 
            const res = await request(app).get(`/season-pass/getItemsFromSeasonPass/${idUser}/${idSeasonPass}`);
            expect(res.statusCode).toEqual(200); 
            expect(res.body).toEqual([]);
        });

        it('debería devolver 500 si el servicio getItemsFromSeasonPass lanza un error', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.checkSeasonPass.mockResolvedValue({ message: "Pase de temporada encontrado" });
            seasonPassService.getItemsFromSeasonPass.mockRejectedValue(new Error("Error DB"));
            const res = await request(app).get(`/season-pass/getItemsFromSeasonPass/${idUser}/${idSeasonPass}`);
            expect(res.statusCode).toEqual(500);
        });

        it('debería devolver 500 si el servicio checkUser lanza un error', async () => {
            seasonPassService.checkUser.mockRejectedValue(new Error("Error checkUser"));
            const res = await request(app).get(`/season-pass/getItemsFromSeasonPass/${idUser}/${idSeasonPass}`);
            expect(res.statusCode).toEqual(500);
        });
    });

    describe('GET /season-pass/getItemsFromLevels/:idUser', () => {
        const idUser = 'userXYZ';
        const mockLevelItems = [ { id_level: 1, unlocked: true, id: 'itemC' } ];

        it('debería devolver los ítems de niveles y estado 200', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.getItemsFromLevels.mockResolvedValue(mockLevelItems);
            const res = await request(app).get(`/season-pass/getItemsFromLevels/${idUser}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockLevelItems);
        });

        it('debería devolver 404 si el usuario no se encuentra', async () => {
            seasonPassService.checkUser.mockResolvedValue(null); 
            const res = await request(app).get(`/season-pass/getItemsFromLevels/${idUser}`);
            expect(res.statusCode).toEqual(404);
        });

        it('debería devolver 404 si no se encuentran ítems de niveles (servicio devuelve null)', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.getItemsFromLevels.mockResolvedValue(null);
            const res = await request(app).get(`/season-pass/getItemsFromLevels/${idUser}`);
            expect(res.statusCode).toEqual(404);
        });

        it('debería devolver 200 con array vacío si no hay ítems de niveles (servicio devuelve array vacío)', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.getItemsFromLevels.mockResolvedValue([]);
            const res = await request(app).get(`/season-pass/getItemsFromLevels/${idUser}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });

        it('debería devolver 500 si el servicio getItemsFromLevels lanza un error', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.getItemsFromLevels.mockRejectedValue(new Error("Error ítems niveles"));
            const res = await request(app).get(`/season-pass/getItemsFromLevels/${idUser}`);
            expect(res.statusCode).toEqual(500);
        });

        it('debería devolver 500 si el servicio checkUser lanza un error', async () => {
            seasonPassService.checkUser.mockRejectedValue(new Error("Error checkUser"));
            const res = await request(app).get(`/season-pass/getItemsFromLevels/${idUser}`);
            expect(res.statusCode).toEqual(500);
        });
    });

    describe('GET /season-pass/getUserLevel/:idUser', () => {
        const idUser = 'levelUser1';
        it('debería devolver el nivel del usuario y estado 200', async () => {
            const mockLevel = { level: 10 };
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.getUserLevel.mockResolvedValue(mockLevel);
            const res = await request(app).get(`/season-pass/getUserLevel/${idUser}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockLevel);
        });

        it('debería devolver 404 si el usuario no se encuentra', async () => {
            seasonPassService.checkUser.mockResolvedValue(null);
            const res = await request(app).get(`/season-pass/getUserLevel/${idUser}`);
            expect(res.statusCode).toEqual(404);
        });

        it('debería devolver 404 si no se puede obtener el nivel (getUserLevel devuelve null)', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.getUserLevel.mockResolvedValue(null);
            const res = await request(app).get(`/season-pass/getUserLevel/${idUser}`);
            expect(res.statusCode).toEqual(404);
        });
        
        it('debería devolver 200 con mensaje si getUserLevel devuelve {message:...}', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.getUserLevel.mockResolvedValue({ message: "Nivel no encontrado en servicio" }); 
            const res = await request(app).get(`/season-pass/getUserLevel/${idUser}`);
            expect(res.statusCode).toEqual(200); 
            expect(res.body).toEqual({ message: "Nivel no encontrado en servicio" });
        });

        it('debería devolver 500 si getUserLevel lanza un error', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.getUserLevel.mockRejectedValue(new Error("Error obteniendo nivel"));
            const res = await request(app).get(`/season-pass/getUserLevel/${idUser}`);
            expect(res.statusCode).toEqual(500);
        });
    });

    describe('GET /season-pass/getUserExperience/:idUser', () => {
        const idUser = 'expUser1';
        it('debería devolver la experiencia del usuario y estado 200', async () => {
            const mockExperience = { experience: 1500 };
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.getUserExperience.mockResolvedValue(mockExperience);
            const res = await request(app).get(`/season-pass/getUserExperience/${idUser}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockExperience);
        });

        it('debería devolver 404 si el usuario no se encuentra', async () => {
            seasonPassService.checkUser.mockResolvedValue(null);
            const res = await request(app).get(`/season-pass/getUserExperience/${idUser}`);
            expect(res.statusCode).toEqual(404);
        });

        it('debería devolver 404 si no se puede obtener la experiencia (getUserExperience devuelve null)', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.getUserExperience.mockResolvedValue(null);
            const res = await request(app).get(`/season-pass/getUserExperience/${idUser}`);
            expect(res.statusCode).toEqual(404);
        });
        
        it('debería devolver 200 con mensaje si getUserExperience devuelve {message:...}', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.getUserExperience.mockResolvedValue({ message: "Experiencia no encontrada en servicio" });
            const res = await request(app).get(`/season-pass/getUserExperience/${idUser}`);
            expect(res.statusCode).toEqual(200); 
            expect(res.body).toEqual({ message: "Experiencia no encontrada en servicio" });
        });

        it('debería devolver 500 si getUserExperience lanza un error', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.getUserExperience.mockRejectedValue(new Error("Fallo obteniendo experiencia"));
            const res = await request(app).get(`/season-pass/getUserExperience/${idUser}`);
            expect(res.statusCode).toEqual(500);
        });
    });

    describe('GET /season-pass/getExperienceToNextLevel/:level', () => {
        const targetLevel = '10';
        it('debería devolver la experiencia para el siguiente nivel y estado 200', async () => {
            const mockExp = { experience: 5000 };
            seasonPassService.getExperienceToNextLevel.mockResolvedValue(mockExp);
            const res = await request(app).get(`/season-pass/getExperienceToNextLevel/${targetLevel}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockExp);
            expect(seasonPassService.getExperienceToNextLevel).toHaveBeenCalledWith(targetLevel);
        });

        it('debería devolver 404 si no se puede obtener la exp (servicio devuelve null)', async () => {
            seasonPassService.getExperienceToNextLevel.mockResolvedValue(null);
            const res = await request(app).get(`/season-pass/getExperienceToNextLevel/${targetLevel}`);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'No se ha podido obtener la experiencia necesaria para el siguiente nivel.');
        });
        
        it('debería devolver 200 con mensaje si servicio devuelve {message:...}', async () => {
            seasonPassService.getExperienceToNextLevel.mockResolvedValue({ message: "Nivel no encontrado" });
            const res = await request(app).get(`/season-pass/getExperienceToNextLevel/${targetLevel}`);
            expect(res.statusCode).toEqual(200); // Comportamiento actual
            expect(res.body).toEqual({ message: "Nivel no encontrado" });
        });

        it('debería devolver 500 si el servicio lanza un error', async () => {
            seasonPassService.getExperienceToNextLevel.mockRejectedValue(new Error("Error DB exp nivel"));
            const res = await request(app).get(`/season-pass/getExperienceToNextLevel/${targetLevel}`);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', "Error DB exp nivel");
        });
    });

    describe('GET /season-pass/hasUserSP/:idUser/:idSeasonPass', () => {
        const idUser = 'userHasSP';
        const idSeasonPass = 'spActive';

        it('debería devolver el estado de posesión del SP y estado 200', async () => {
            const mockOwnership = { unlocked: true };
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.checkSeasonPass.mockResolvedValue({ message: "Pase de temporada encontrado" });
            seasonPassService.hasUserSP.mockResolvedValue(mockOwnership);

            const res = await request(app).get(`/season-pass/hasUserSP/${idUser}/${idSeasonPass}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockOwnership);
        });

        it('debería devolver 404 si el usuario o el pase no se encuentran (checkUser devuelve null)', async () => {
            seasonPassService.checkUser.mockResolvedValue(null);
            seasonPassService.checkSeasonPass.mockResolvedValue({ message: "Pase de temporada encontrado" });
            const res = await request(app).get(`/season-pass/hasUserSP/${idUser}/${idSeasonPass}`);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Usuario o pase de temporada no encontrado.');
        });
        
        it('debería devolver 404 si el usuario o el pase no se encuentran (checkSeasonPass devuelve null)', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.checkSeasonPass.mockResolvedValue(null);
            const res = await request(app).get(`/season-pass/hasUserSP/${idUser}/${idSeasonPass}`);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Usuario o pase de temporada no encontrado.');
        });

        it('debería devolver 404 si no se puede determinar la posesión (hasUserSP devuelve null)', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.checkSeasonPass.mockResolvedValue({ message: "Pase de temporada encontrado" });
            seasonPassService.hasUserSP.mockResolvedValue(null);
            const res = await request(app).get(`/season-pass/hasUserSP/${idUser}/${idSeasonPass}`);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'No se ha si el usuario ha desbloqueado el pase de pago.');
        });
        
        it('debería devolver 200 con mensaje si hasUserSP devuelve {message:...}', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.checkSeasonPass.mockResolvedValue({ message: "Pase de temporada encontrado" });
            seasonPassService.hasUserSP.mockResolvedValue({ message: "Usuario no encontrado en SP_for_user" });
            const res = await request(app).get(`/season-pass/hasUserSP/${idUser}/${idSeasonPass}`);
            expect(res.statusCode).toEqual(200); // Comportamiento actual
            expect(res.body).toEqual({ message: "Usuario no encontrado en SP_for_user" });
        });

        it('debería devolver 500 si el servicio hasUserSP lanza un error', async () => {
            seasonPassService.checkUser.mockResolvedValue({ message: "Usuario encontrado" });
            seasonPassService.checkSeasonPass.mockResolvedValue({ message: "Pase de temporada encontrado" });
            seasonPassService.hasUserSP.mockRejectedValue(new Error("Error DB hasUserSP"));
            const res = await request(app).get(`/season-pass/hasUserSP/${idUser}/${idSeasonPass}`);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', "Error DB hasUserSP");
        });
    });
});

