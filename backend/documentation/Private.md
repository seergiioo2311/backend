# 📌 API Documentation Partidas Privadas

Esta API permite gestionar los logros de un usuario, incluyendo la obtención de logros conseguidos, no conseguidos y el porcentaje de progreso.

---
## 🏆 1. Crear Partidas Privadas (Obtener enlace y crear en la BBDD)
**Método:** `POST`  
**URL:** `http://localhost:3000/private/create`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Parámetros en la ruta:
| Nombre  | Tipo  | Descripción                                |
|---------|-------|--------------------------------------------|
| `passwd`    | String | Contraseña que tendrá la partida privada  para poder unirse|
| `maxPlayers` | Number | Máximo número de jugadores que podrán unirse a la partida privada |

### 📌 Cuerpo de la peticion:
~~~json
{
    "passwd": "12345",
    "achievement_id": "4"
}
~~~

### 📌 Respuesta de la Petición
~~~json
{"link": "http://...."} //El enlace al endpoint donde se esta jugando la partida privada.
~~~
💡 **Nota:** Esta funcionalidad está a la espera de ser terminada ya que es necesario que el equipo de game server haga su parte para generar los enlaces solicitados.

### 📌 Errores
- **500 Internal Server Error**: En caso de error interno del servidor.

---

## 📉 2. Obtener Partidas Privadas
**Método:** `GET`  
**URL:** `http://localhost:3000/private/

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Respuesta de la Petición
~~~json
{
  "privateGames": [
        {
            "id": "1",
            "maxPlayers": "10",
            "currentPlayers": "5",
        },
        {
            ...
        }
    ]
}
~~~

### 📌 Explicación de Campos
| Campo        | Descripción                               |
|-------------|------------------------------------------|
| `id`| El identificador de la partida privada|
| `maxPlayers`| El máximo numero de jugadores que puede haber en esa partida privada |
| `currentPlayers` | El número de jugadores que actualmente están jugando la partida |

### 📌 Errores
- **500 Internal Server Error**: En caso de error interno del servidor.

---

## 📉 3. Unirse a partida privada (obtener enlace al endpoint)
**Método:** `POST`  
**URL:** `http://localhost:3000/private/join`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Cuerpo de la peticion:
~~~json
{
    "gameId": "5",
    "passwd": "12345"
}
~~~

### 📌 Respuesta de la Petición
~~~json
    {"link": "http://..."}
~~~

### 📌 Explicación de Campos
| Campo        | Descripción                               |
|-------------|------------------------------------------|
| `link`| Enlace al endpoint donde se esta jugando la partida privada|

### 📌 Errores
- **404 Not Found**: Si la contraseña o el id de partida no son correctos.
- **500 Internal Server Error**: En caso de error interno del servidor.

---
## 📉 4. Eliminar partida privada
**Método:** `DELETE`  
**URL:** `http://localhost:3000/private/delete/:id`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Parámetros en la ruta:
| Nombre  | Tipo  | Descripción                                |
|---------|-------|--------------------------------------------|
| `id`    | Number | El identificador de la partida privada |


### 📌 Respuesta de la Petición
~~~json
    {"message": "Partida privada eliminada correctamente"}
~~~

### 📌 Errores
- **400 No Parameter **: Si no hay un id de partida en la ruta
- **404 Not Found **: Si no hay una partida con el id dado
- **500 Internal Server Error**: En caso de error interno del servidor.

