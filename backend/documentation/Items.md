# 📌 API Documentation Items

Esta API permite gestionar los items de un usuario, asi como permitir "desbloquear" items y seleccionar los items.

---
## 🤝 1. Desbloquear item
**Método:** `POST`  
**URL:** `http://localhost:3000/items/assign-item`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Cuerpo de la peticion:
~~~json
{
    "user_id": "b3e1f74b-6c2a-4d98-8c4b-2e7f3a1d9e6d",
    "item_id": "12"
}
~~~

### 📌 Respuesta de la Petición
~~~json
{
    "message": "Item asignado correctamente"
}
~~~
💡 **Nota:** En caso de error el estado de la respuesta sera o 404 o 500, dependiendo deltipo de error: 404 en caso de que user_id o item_id no sean válidos y 500 en caso de error interno de servidor

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
| `username`    | String / Number | ID que se está usando para la comprobación (por ruta). |

> **Importante:** Aunque la ruta está definida como `GET`, en el código se toma `req.body.id` para la comprobación. Si necesitas comprobar a un usuario específico, asegúrate de enviar su ID en el body. 

### 📌 Cuerpo de la Petición:
~~~json
{
  "username": "nombre_de_usuario_a_comprobar"
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

