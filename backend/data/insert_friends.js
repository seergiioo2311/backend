const { getIdByUsername } = require("../src/services/mainScreenService"); 
const { addFriend } = require("../src/services/friendsService");

const insertFriends = async () => {
    try {
      const friendships = [
        { user1: "user1", user2: "user2" },
        { user1: "user1", user2: "user3" },
        { user1: "user1", user2: "user4" },
        { user1: "user1", user2: "user5" },
        { user1: "user1", user2: "user6" },
        { user1: "user1", user2: "user7" },
        { user1: "user1", user2: "user8" },
        { user1: "user1", user2: "user9" },
        // Puedes agregar más relaciones de amistad aquí
      ];
  
      for (const { user1, user2 } of friendships) {
        const idUser1 = await getIdByUsername(user1);
        const idUser2 = await getIdByUsername(user2);
  
        if (!idUser1 || !idUser2) {
          console.log(`No se encontraron los usuarios ${user1} o ${user2}`);
          continue;
        }
  
        const result = await addFriend(idUser1, idUser2, "Accepted");
        console.log(`Amistad añadida entre ${user1} y ${user2}:`, result.message);
      }
  
      console.log("[ + ] Todas las relaciones de amistad han sido insertadas.");
    } catch (error) {
      console.error("[ - ] Error insertando relaciones de amistad:", error);
    }
  };
  
  // Ejecutar la función
  module.exports = { insertFriends };