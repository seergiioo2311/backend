const request = require('supertest');
const app = require('../src/app');

describe("🧪 API de objetos", () => {
  // ---------- Tests para ASSIGN_ITEM ----------
  // Test para asignar un objeto a un usuario existente
  test("🔐 Asignar un objeto a un usuario", async () => {
    const response = await request(app).post('/items/assign-item').send({ user_id: "b3e1f74b-6c2a-4d98-8c4b-2e7f3a1d9e6d", item_id: 1 });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  // Test para asignar un objeto a un usuario que no existe
  test("🔐 Asignar un objeto a un usuario que no existe", async () => {
    const response = await request(app).post('/items/assign-item').send({ user_id: "1000", item_id: 1 });
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message');
  });

  // Test para asignar un objeto que no existe a un usuario existente
  test("🔐 Asignar un objeto que no existe a un usuario", async () => {
    const response = await request(app).post('/items/assign-item').send({ user_id: "b3e1f74b-6c2a-4d98-8c4b-2e7f3a1d9e6d", item_id: 1000 });
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message');
  });

  // ---------- Tests para GET_ALL_ITEMS ----------
  // Test para obtener todos los objetos de un usuario existente
  test("🔐 Obtener todos los objetos de un usuario", async () => {
    const response = await request(app).get('/items/get-all-items/').send({ user_id: "b3e1f74b-6c2a-4d98-8c4b-2e7f3a1d9e6d" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('items');
  });
  
  // Test para obtener todos los objetos de un usuario que no existe
  test("🔐 Obtener todos los objetos de un usuario que no existe", async () => {
    const response = await request(app).get('/items/get-all-items').send({ user_id: "1000" });
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message');
  });

  
});
