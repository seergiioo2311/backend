const request = require('supertest');
const app = require('../src/app');

describe("🧪 API de logros", () => {
  // ---------- Tests para GET_ACHIEVEMENTS ----------
  // Test para obtener todos los logros
  test("🔐 Obtener logros de un usuario", async () => {
    const response = await request(app).get('/achievements/achievements/b3e1f74b-6c2a-4d98-8c4b-2e7f3a1d9e6d');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('achievements');
  });
  
  // Test para obtener logros no obtenidos
  test("🔐 Obtener logros no obtenidos de un usuario", async () => {
    const response = await request(app).get('/achievements/unachieved-achievements/b3e1f74b-6c2a-4d98-8c4b-2e7f3a1d9e6d');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('achievements');
  });

  // Test para obtener logros no obtenidos de un usuario que no existe
  test("🔐 Obtener logros no obtenidos de un usuario que no existe", async () => {
    const response = await request(app).get('/achievements/unachieved-achievements/1000');
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message');
  });

  // Test para obtener logros de un usuario que no existe
  test("🔐 Obtener logros de un usuario que no existe", async () => {
    const response = await request(app).get('/achievements/achievements/1000');
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message');
  });

});
