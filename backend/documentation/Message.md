# 📌 API Documentation Mensajes

Esta API permite gestionar los mensajes entre dos usuarios, incluyendo el id del usuario emisor, el id del usuario receptor, el contenido del mensaje y la fecha del mensaje.

---
## 📩 1. Obtener Mensajes de un Usuario
**Método:** `GET`
**URL:** `http://localhost:3000/messages/get_messages/:idEmisor/:idReceptor`

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Parámetros en la ruta:
| Nombre       | Tipo   | Descripción                                |
|--------------|--------|--------------------------------------------|
| `idEmisor`   | Number | ID del usuario emisor.                     |
| `idReceptor` | Number | ID del usuario receptor.                   |

### 📌 Respuesta de la Petición
~~~json
[
  {
    "id_friend_emisor": 1,
    "id_friend_receptor": 2,
    "content": "Hola, ¿cómo estás?",
    "date": "12:00"
  },
  {
    "id_friend_emisor": 1,
    "id_friend_receptor": 2,
    "content": "Bien, gracias. ¿Y tú?",
    "date": "12:00"
  }
]
~~~
💡 **Nota:** Los campos específicos de cada logro dependen de la estructura definida en el modelo `Achievement`.

### 📌 Errores
- **404 Not Found**: Si cualquiera de los usuarios no existe en el sistema.

- **500 Internal Server Error**: En caso de error interno del servidor.

---

## 📩 2. Agregar un Mensaje
**Método:** `POST`
**URL:** `http://localhost:3000/messages/add_message`

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |


### 📌 Cuerpo de la Petición:
~~~json
{
  "id": "id del mensaje",
  "id_friend_emisor": "id del usuario emisor",
  "id_friend_receptor": "id del usuario receptor",
  "content": "contenido del mensaje",
  "date": "fecha del mensaje"
}
~~~

### 📌 Respuesta de la Petición
~~~json
{
  "message": "Mensaje de éxito o de error",
  "data": "Información adicional en caso de éxito o error"
}
~~~

### 📌 Errores
- **400 Bad Request:** Si alguno de los usuarios no existe o si el contenido del mensaje es vacío o nulo.

- **500 Internal Server Error:** En caso de error interno del servidor.
