const request = require('supertest');
const app = require('../src/app');

describe("🧪 API de partidas privadas", () => {
    // ---------- Tests para CREATE_PRIVATE_GAME ----------
    test("🔐 Crear partida privada", async () => {
        const response = await request(app).post('/private/create').send({ maxPlayers: 4, passwd: "1234" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('link');
    });
    // ---------- Tests para GET_PRIVATE_GAMES ----------
    test("🔐 Obtener partidas privadas", async () => {
        const response = await request(app).get('/private/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('privateGames');
    });
    // ---------- Tests para JOIN_PRIVATE_GAME ----------
    test("🔐 Unirse a partida privada", async () => {
        const response = await request(app).post('/private/join').send({ gameId: 1, passwd: "1234" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('link');
    });
    test("🔐 Unirse a partida privada con contraseña incorrecta", async () => {
        const response = await request(app).post('/private/join').send({ gameId: 1, passwd: "wrong_pass" });
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
    });
    test("🔐 Unirse a partida privada que no existe", async () => {
        const response = await request(app).post('/private/join').send({ gameId: 1000, passwd: "1234" });
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
    });
    test("🔐 Unirse a partida privada sin contraseña", async () => {
        const response = await request(app).post('/private/join').send({ gameId: 1 });
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
    });
    test("🔐 Unirse a partida privada sin id", async () => {
        const response = await request(app).post('/private/join').send({ passwd: "1234" });
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
    });
    test("🔐 Unirse a partida privada sin id y sin contraseña", async () => {
        const response = await request(app).post('/private/join').send({});
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
    });
    // ---------- Tests para DELETE_PRIVATE_GAME ----------
    test("🔐 Eliminar partida privada", async () => {
        const response = await request(app).delete('/private/delete/1')
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
    });
});
