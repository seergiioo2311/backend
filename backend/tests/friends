const  request = require('supertest');
const app = require('../src/app');

describe("🧪 API de amigos", () => {
  // ---------- Tests para GET_FRIENDS (obtener amigos) ----------
  // Test para obtener amigos de un usuario que existe
  test("🔐 Obtener amigos: usuario que existe", async () => {
    const response = await request(app).get('/friends/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('friends');
  });

  // Test para obtener amigos de un usuario que no existe
  test("🔐 Obtener amigos: usuario que no existe", async () => {
    const response = await request(app).get('/friends/1000');
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message');
  });

  // ---------- Tests para ADD_FRIEND (agregar amigo) ----------
  // Test para agregar un amigo a un usuario que existe
  test("🔐 Agregar amigo: usuario que existe", async () => {
    const response = await request(app).post('/friends/1').send({
      id: 2,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  // Test para agregar un amigo a un usuario que no existe
  test("🔐 Agregar amigo: usuario que no existe", async () => {
    const response = await request(app).post('/friends/1000').send({
      id: 2,
    });
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message');
  });

  // Test para agregar un amigo que no existe
  test("🔐 Agregar amigo: amigo que no existe", async () => {
    const response = await request(app).post('/friends/1').send({
      id: 1000,
    });
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message');
  });
  
  // ---------- Tests para DEL_FRIEND (eliminar amigo) ----------
  // Test para eliminar un amigo de un usuario que existe, de una relacion de amigos que existe
  test("🔐 Eliminar amigo: usuario que existe", async () => {
    const response = await request(app).delete('/friends/1').send({
      id: 2,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  // Test para eliminar un amigo de un usuario que no existe
  test("🔐 Eliminar amigo: usuario que no existe", async () => {
    const response = await request(app).delete('/friends/1000').send({
      id: 2,
    });
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message');
  });

  // Test para eliminar un amigo que no existe
  test("🔐 Eliminar amigo: amigo que no existe", async () => {
    const response = await request(app).delete('/friends/1').send({
      id: 1000,
    });
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message');
  });

  // Test para eliminar un amigo de un usuario que existe, pero la relacion de amigos no existe
  test("🔐 Eliminar amigo: relación de amigos que no existe", async () => {
    const response = await request(app).delete('/friends/1').send({
      id: 2,
    });
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message');
  });

  // ---------- Tests para CHECK_USER (verificar usuario) ----------
  // Test para verificar un usuario que existe
  test("🔐 Verificar usuario: usuario que existe", async () => {
    const response = await request(app).get('/friends/1/check_user');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  // Test para verificar un usuario que no existe
  test("🔐 Verificar usuario: usuario que no existe", async () => {
    const response = await request(app).get('/friends/1000/check_user');
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message');
  });

  // ---------- Notas adicionales ----------
  // Se comprueban todas las rutas de la API de amigos
  // Se comprueban los casos de éxito y error de cada ruta
});
