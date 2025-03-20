const { sign_up } = require("../src/controllers/authController"); // Importamos el controlador de sign_up

const users = [
  {
    username: "user1",
    email: "user1@example.com",
    password: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
  },
  {
    username: "user2",
    email: "user2@example.com",
    password: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
  },
  {
    username: "user3",
    email: "user3@example.com",
    password: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
  },
  // Agrega más usuarios aquí si lo necesitas
];

// Función para insertar los usuarios
const insertUsers = async () => {
  try {
    for (const user of users) {
      // Llamamos a la función sign_up para crear el usuario
      const mockRequest = {
        body: {
          username: user.username,
          email: user.email,
          password: user.password,
        },
      };

      // Creamos una respuesta mock para obtener el resultado de la función
      const mockResponse = {
        status: (statusCode) => ({
          json: (data) => console.log(`Respuesta con código ${statusCode}:`, data),
        }),
      };

      // Llamamos a la función sign_up y pasamos el mockRequest y mockResponse
      await sign_up(mockRequest, mockResponse);
    }

    console.log("[ + ] Todos los usuarios han sido insertados.");
  } catch (error) {
    console.error("[ - ] Error insertando usuarios:", error);
  }
};

// Ejecutar la función
module.exports = { insertUsers };
