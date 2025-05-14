# API PARA EL SERVER PARA PARTIDAS PRIVADAS

## Cuando se empiecen a unir jugadores a una partida privada habrá que obtener de las cookies el ID de la partida privada
## (gameId). En primer lugar habrá que llamar a la función 1. Empezar partida privada, en segundo lugar habrá que llamar
## a la función 2. Obtener valores partida privada.
##
## Cuando los jugadores hayan votado por pausar la partida privada, en primer lugar habrá que llamar a la función 
## 3. Pausar partida privada, en segundo lugar habrá que llamar a la función 4. Guardar valores partida privada.

---
## 1. Empezar partida privada (para información relativa al frontend y al backend)
**Método** `POST`
**URL:** `http://galaxy.t2dc.es:3000/private/startPrivateGame`

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Parámetros en la ruta:
No hay parámetros en la ruta

### 📌 Cuerpo de la peticion:
~~~json
{
    "gameId": "1",
}
~~~

### 📌 Respuesta de la Petición
~~~json
{"message": "OK"} 
~~~


### 📌 Errores
- **500 Internal Server Error**: En caso de error interno del servidor.

---
## 2. Obtener valores partida privada (devuelve los valores de todos los jugadores de la partida privada)
**Método** `GET`
**URL:** `http://galaxy.t2dc.es:3000/private/getValues/:gameId`

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Parámetros en la ruta:
| Nombre  | Tipo  | Descripción                                |
|---------|-------|--------------------------------------------|
| `gameId`    | Number | Id de la partida privada de la que se quieren obtener los valores|

### 📌 Cuerpo de la peticion:
~~~json
Esta operación no requiere cuerpo de la petición
~~~

### 📌 Respuesta de la Petición
~~~json
[
    {
        "id_user": 34223423241,
        "x_position": 10,
        "y_position": 20,
        "n_divisions": 3,
        "score": 150
    },
    {
        "id_user": 34223423241,
        "x_position": 15,
        "y_position": 25,
        "n_divisions": 2,
        "score": 200
    }
]
~~~

### 📌 Errores
- **500 Internal Server Error**: En caso de error interno del servidor.

---
## 3. Pausar partida privada (para información relativa al frontend y al backend)
**Método** `POST`
**URL:** `http://galaxy.t2dc.es:3000/private/pausePrivateGame`

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Parámetros en la ruta:
No hay parámetros en la ruta

### 📌 Cuerpo de la peticion:
~~~json
{
    "gameId": "1",
}
~~~

### 📌 Respuesta de la Petición
~~~json
{"message": "OK"} 
~~~


### 📌 Errores
- **500 Internal Server Error**: En caso de error interno del servidor.

---
## 4. Guardar valores partidas privadas (guarda todos los valores de una partida privada)
**Método** `POST`
**URL:** `http://galaxy.t2dc.es:3000/private/uploadValues/:gameId`

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Parámetros en la ruta:
| Nombre  | Tipo  | Descripción                                |
|---------|-------|--------------------------------------------|
| `gameId`    | Number | Id de la partida privada de la que se quieren obtener los valores|

### 📌 Cuerpo de la peticion:
~~~json
{
    "values": [
        {
            "id_user": "user1-uuid",
            "x_position": 10,
            "y_position": 20,
            "n_divisions": 3,
            "score": 150
        },
        {
            "id_user": "user2-uuid",
            "x_position": 15,
            "y_position": 25,
            "n_divisions": 2,
            "score": 200
        }
    ]
}
~~~

### 📌 Respuesta de la Petición
~~~json
{"message": "Valores actualizados correctamente"} 
~~~


### 📌 Errores
- **500 Internal Server Error**: En caso de error interno del servidor.

---