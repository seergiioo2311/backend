# 📌 API Documentacion Tienda

Esta API permite gestionar las tiendas dentro de la web.

---
## 🏆 1. Obtener Items de una Tienda
**Método:** `GET`  
**URL:** `http://localhost:3000/store/getItems/:shop_id`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Parámetros en la ruta:
| Nombre  | Tipo  | Descripción                                |
|---------|-------|--------------------------------------------|
| `id`    | Number | ID de la tienda sobre la cual conseguir los items |

### 📌 Respuesta de la Petición TBD
~~~json
[
  {
    "name_item": "Skin Galactica",
    "item_type": "Skin",
    "item_price": "12.99"
  },
  {
    ...
  }
]
~~~

### 📌 Errores
- **404 Not Found**: Si no se han encontrado items
- **500 Internal Server Error**: En caso de error interno del servidor.

---

## 📉 2. Obtener Nombre de la Tienda
**Método:** `GET`  
**URL:** `http://localhost:3000/shop/:shop_id`

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Parámetros en la ruta:
| Nombre  | Tipo  | Descripción                                |
|---------|-------|--------------------------------------------|
| `id`    | Number | ID de la tienda sobre la que obtener el nombre |

### 📌 Respuesta de la Petición TBD
~~~json
{
    "shop_name": "Tienda de skins."
}
~~~

### 📌 Errores
- **404 Not Found**: Si la tienda no existe
- **500 Internal Server Error**: En caso de error interno del servidor.

---

---
## 📉 3. Desbloquear Skin
**Método:** `POST`  
**URL:** `http://localhost:3000/purchased

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Cuerpo de la peticion:
~~~json
{
    "item_id": "12",
    "user_name": "pedro"
}
~~~

### 📌 Respuesta de la Petición
~~~json
 {
     "message": "Item asociado al usuario correctamente."
 }
~~~

### 📌 Explicación de Campos
| Campo        | Descripción                               |
|-------------|------------------------------------------|
| `mensaje`| Mensaje que confirma el éxito         |

### 📌 Errores
- **404 Not Found**: Si el usuario no existe en el sistema, o no se puede asociar el item al usuario.
- **500 Internal Server Error**: En caso de error interno del servidor.

---

> **Importante:** Todas las rutas requieren autenticación previa y el ID debe corresponder a un usuario válido en el sistema.


