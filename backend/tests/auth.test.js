const request = require('supertest');
const app = require('../src/app');

describe("🧪 API de autenticación (Chatti)", () => {

  // ---------- Tests para SIGN-IN (login) ----------

  test("🔐 Login: usuario que existe, credenciales correctas", async () => {
    const response = await request(app).post('/auth/sign-in').send({
      email: 'ivandezad2@gmail.com',
      password: '123456789',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
  });

  test("🔐 Login: usuario inexistente", async () => {
    const response = await request(app).post('/auth/sign-in').send({
      email: 'noexiste@gmail.com',
      password: '123456789',
    });
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  test("🔐 Login: contraseña incorrecta", async () => {
    const response = await request(app).post('/auth/sign-in').send({
      email: 'ivandezad2@gmail.com',
      password: '12345678',
    });
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  test("🔐 Login: faltan campos (sin email)", async () => {
    const response = await request(app).post('/auth/sign-in').send({
      password: '123456789',
    });
    expect(response.statusCode).toBe(400); // o el código que manejes para validación
    expect(response.body).toHaveProperty('message');
  });

  test("🔐 Login: faltan campos (sin password)", async () => {
    const response = await request(app).post('/auth/sign-in').send({
      email: 'ivandezad2@gmail.com',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  // ---------- Tests para SIGN-UP (registro) ----------

  test("🔐 Registro: usuario nuevo se registra correctamente", async () => {
    const response = await request(app).post('/auth/sign-up').send({
      email: 'correotest@gmail.com',
      password: '12345678910',
      username: 'test'
    });
    await request(app).delete('/auth/delete-user').send({
      email: 'correotest@gmail.com',
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message');
  });

  test("🔐 Registro: intentar registrar con correo ya existente", async () => {
    // Primero, se registra el usuario (si no se registró ya en otro test)
    await request(app).post('/auth/sign-up').send({
      email: 'duplicado@gmail.com',
      password: '12345678910',
      username: 'testDup'
    });

    // Se intenta registrar nuevamente con el mismo email
    const response = await request(app).post('/auth/sign-up').send({
      email: 'duplicado@gmail.com',
      password: '12345678910',
      username: 'testDup'
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  test("🔐 Registro: faltan campos en el registro (sin email)", async () => {
    const response = await request(app).post('/auth/sign-up').send({
      password: '12345678910',
      username: 'test'
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  test("🔐 Registro: faltan campos en el registro (sin password)", async () => {
    const response = await request(app).post('/auth/sign-up').send({
      email: 'nuevo@gmail.com',
      username: 'test'
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  test("🔐 Registro: faltan campos en el registro (sin username)", async () => {
    const response = await request(app).post('/auth/sign-up').send({
      email: 'nuevo2@gmail.com',
      password: '12345678910'
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  // ---------- Tests para FORGOT-PASSWORD ----------

  test("🔐 Recuperación de contraseña: correo existente", async () => {
    const response = await request(app).post('/auth/forgot-password').send({
      email: 'ivandezad@gmail.com',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
  }, 10000); // Timeout extendido si es necesario

  test("🔐 Recuperación de contraseña: correo no existente", async () => {
    const response = await request(app).post('/auth/forgot-password').send({
      email: 'noExiste@gmail.com',
    });
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message');
  });

  test("🔐 Recuperación de contraseña: faltan datos (sin email)", async () => {
    const response = await request(app).post('/auth/forgot-password').send({});
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  // ---------- Tests para DELETE-USER ----------

  test("🔐 Eliminar usuario: usuario existente es eliminado", async () => {
    // Primero se registra o se asegura que el usuario exista
    await request(app).post('/auth/sign-up').send({
      email: 'borrar@gmail.com',
      password: '123456789',
      username: 'borrarUser'
    });

    const response = await request(app).delete('/auth/delete-user').send({
      email: 'borrar@gmail.com',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  test("🔐 Eliminar usuario: intentar eliminar un usuario que no existe", async () => {
    const response = await request(app).delete('/auth/delete-user').send({
      email: 'noexisteparaborrar@gmail.com',
    });
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message');
  });

  test("🔐 Eliminar usuario: faltan datos (sin email)", async () => {
    const response = await request(app).delete('/auth/delete-user').send({});
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  // ---------- Notas adicionales ----------
  // Los endpoints que requieren token u otros parámetros de autenticación se testean
  // por separado con mocks o inyectando un token válido en la cabecera.
});

