const { getIdByUsername } = require("../src/services/mainScreenService"); 
const { addSolicitud } = require("../src/services/friendsService");

const insertRequests = async () => {
    try {
      const friendships = [
        { user1: "user2", user2: "user1" },
        { user1: "user3", user2: "user1" },
        { user1: "user4", user2: "user1" },
        { user1: "user5", user2: "user1" },
        { user1: "user6", user2: "user1" },
        { user1: "user7", user2: "user1" },
        { user1: "user8", user2: "user1" },
        { user1: "user9", user2: "user1" },
        // Puedes agregar más relaciones de amistad aquí
      ];
  
      for (const { user1, user2 } of friendships) {
        const idUser1 = await getIdByUsername(user1);
        const idUser2 = await getIdByUsername(user2);
  
        if (!idUser1 || !idUser2) {
          continue;
        }
  
        const result = await addSolicitud(idUser1, idUser2, "Pending");
      }
  
      console.log("[ + ] Todas las solicitudes de amistad han sido insertadas.");
    } catch (error) {
      console.error("[ - ] Error insertando solicitudes de amistad:", error);
    }
  };
  
  // Ejecutar la función
  module.exports = { insertRequests };
