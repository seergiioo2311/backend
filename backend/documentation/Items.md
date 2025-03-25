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
---


