const request = require('supertest');
const app = require('../src/app');

describe("🧪 API de partidas privadas", () => {
// ----------- Tests para CREATE_PRIVATE_GAME ----------
// Test para crear una partida privada con un nombre válido
    test("🔐 Crear una partida privada con un nombre válido", async () => {
        const response = await request(app).post('/private/create').send({ name: "Test", passwd: "test", maxPlayers: "4" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id');
    });
// Test para crear una partida privada con una contraseña vacia
    test("🔐 Crear una partida privada con una contraseña vacia", async () => {
        const response = await request(app).post('/private/create').send({ maxPlayers: 4 });
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
    });
// Test para crear una partida privada con maxPlayers vacio
    test("🔐 Crear una partida privada con maxPlayers vacio", async () => {
        const response = await request(app).post('/private/create').send({ passwd: "test" });
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
    });
// Test para crear una partida privada con maxPlayers menor a 2
    test("🔐 Crear una partida privada con maxPlayers menor a 2", async () => {
        const response = await request(app).post('/private/create').send({ passwd: "test", maxPlayers: 1 });
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
    });
// ----------- Tests para GET_PRIVATE_GAME ----------
// Test para obtener todas las partidas privadas existentes
    test("🔐 Obtener todas las partidas privadas existentes", async () => {
        const response = await request(app).get('/private/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('privateGames');
    });
// --------- Tests para GET_PRIVATE_ENDPOINT ----------
// Test para obtener una partida privada existente
    test("🔐 Obtener una partida privada existente", async () => {
        const response = await request(app).post('/private/join').send({ gameId: 9, passwd: "test" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('link');
    });
// Test para obtener una partida privada que no existe
    test("🔐 Obtener una partida privada que no existe", async () => {
        const response = await request(app).post('/private/join').send({ gameId: 1000, passwd: "test" });
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
    });
// Test para obtener una partida privada con una contraseña incorrecta
    test("🔐 Obtener una partida privada con una contraseña incorrecta", async () => {
        const response = await request(app).post('/private/join').send({ gameId: 1, passwd: "wrong" });
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
    });
// --------- Tests para DELETE_PRIVATE_GAME ----------
// Test para eliminar una partida privada existente
    test("🔐 Eliminar una partida privada existente", async () => {
        const gameId = await request(app).get('/private/').then(res => res.body.privateGames[0].id);
        const response = await request(app).delete('/private/delete').send({ gameId: gameId });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
    });
// Test para eliminar una partida privada que no existe
    test("🔐 Eliminar una partida privada que no existe", async () => {
        const response = await request(app).delete('/private/delete').send({ gameId: 1000 });
        expect(response.statusCode).toBe(404);
    });
// ---------- Tests para GET_PLAYERS ----------
// Test para obtener los jugadores de una partida privada existente
    test("🔐 Obtener los jugadores de una partida privada existente", async () => {
        const response = await request(app).get('/private/players/13');
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('players');
    });
// Test para obtener los jugadores de una partida privada que no existe
    test("🔐 Obtener los jugadores de una partida privada que no existe", async () => {
        const response = await request(app).get('/private/players/1000');
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
    });
// ---------- Tests para Is_Ready ----------
// Test para cambiar el estado de un jugador a listo
//    test("🔐 Cambiar el estado de un jugador a listo", async () => {
//        const response = await request(app).post('/private/ready').send({ gameId: 13, userId: 1 });
//        expect(response.statusCode).toBe(200);
//        expect(response.body).toHaveProperty('message');
//    });
// Test para cambiar el estado de un jugador que no existe
    test("🔐 Cambiar el estado de un jugador que no existe", async () => {
        const response = await request(app).post('/private/ready').send({ gameId: 13, userId: 1000 });
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
    });

// ---------- Tests para all_players ----------
// Test para obtener todos los jugadores de una partida privada existente
    test("🔐 Obtener todos los jugadores de una partida privada existente", async () => {
        const response = await request(app).get('/private/allPlayers/13');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('players');
    });

// ------- Tests para getLink -------
// Test para obtener el link de una partida privada existente
    test("🔐 Obtener el link de una partida privada existente", async () => {
        const response = await request(app).get('/private/link/13');
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('link');
    });

});
