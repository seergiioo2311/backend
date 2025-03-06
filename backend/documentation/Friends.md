# 📌 API Documentation Amigos

Esta API permite gestionar la lista de amigos de un usuario, permitiendo obtener, agregar y eliminar amigos, así como comprobar la existencia de un usuario en la base de datos.

---
## 🤝 1. Obtener Amigos
**Método:** `GET`  
**URL:** `http://localhost:3000/friends/:id`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Parámetros en la ruta:
| Nombre  | Tipo  | Descripción                                |
|---------|-------|--------------------------------------------|
| `id`    | String / Number | ID del usuario cuyo listado de amigos deseas obtener. |

### 📌 Respuesta de la Petición
~~~json
[
  {
    "id": "id_del_amigo_1",
    "nombre": "nombre_del_amigo_1"
  },
  {
    "id": "id_del_amigo_2",
    "nombre": "nombre_del_amigo_2"
  }
]
~~~
💡 **Nota:** El formato de respuesta puede variar según la estructura que devuelva la base de datos.

---

## ➕ 2. Agregar Amigo
**Método:** `POST`  
**URL:** `http://localhost:3000/friends/:id`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Parámetros en la ruta:
| Nombre  | Tipo  | Descripción                              |
|---------|-------|------------------------------------------|
| `id`    | String / Number | ID del usuario que agregará a un nuevo amigo. |

### 📌 Cuerpo de la Petición:
~~~json
{
  "id": "ID_del_usuario_que_se_desea_agregar_como_amigo"
}
~~~

### 📌 Respuesta de la Petición
~~~json
{
  "message": "Mensaje de éxito o de error",
  "data": "Información adicional en caso de éxito o error"
}
~~~

---

## ❌ 3. Eliminar Amigo
**Método:** `DELETE`  
**URL:** `http://localhost:3000/friends/:id`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Parámetros en la ruta:
| Nombre  | Tipo  | Descripción                                     |
|---------|-------|-------------------------------------------------|
| `id`    | String / Number | ID del usuario que eliminará un amigo. |

### 📌 Cuerpo de la Petición:
~~~json
{
  "id": "ID_del_usuario_que_se_desea_eliminar_de_amigos"
}
~~~

### 📌 Respuesta de la Petición
~~~json
{
  "message": "Mensaje de éxito o de error",
  "data": "Información adicional en caso de éxito o error"
}
~~~

---

## 🔎 4. Comprobar Usuario
**Método:** `GET`  
**URL:** `http://localhost:3000/friends/:id/check_user`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Parámetros en la ruta:
| Nombre  | Tipo  | Descripción                                           |
|---------|-------|-------------------------------------------------------|
| `id`    | String / Number | ID que se está usando para la comprobación (por ruta). |

> **Importante:** Aunque la ruta está definida como `GET`, en el código se toma `req.body.id` para la comprobación. Si necesitas comprobar a un usuario específico, asegúrate de enviar su ID en el body. 

### 📌 Cuerpo de la Petición:
~~~json
{
  "id": "ID_del_usuario_que_se_desea_comprobar"
}
~~~

### 📌 Respuesta de la Petición
~~~json
{
"message": "Usuario encontrado"
}
~~~
O
~~~json
{
"message": "Usuario no encontrado"
}
~~~
Dependiendo de si el usuario existe o no en la base de datos.

---

