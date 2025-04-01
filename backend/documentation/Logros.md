# 📌 API Documentation Logros

Esta API permite gestionar los logros de un usuario, incluyendo la obtención de logros conseguidos, no conseguidos y el porcentaje de progreso.

---
## 🏆 1. Obtener Logros del Usuario
**Método:** `GET`  
**URL:** `http://localhost:3000/achievements/:id`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Parámetros en la ruta:
| Nombre  | Tipo  | Descripción                                |
|---------|-------|--------------------------------------------|
| `id`    | Number | ID del usuario cuyos logros obtenidos se desean recuperar. |

### 📌 Respuesta de la Petición
~~~json
[
  {
    "id": 1,
    "nombre": "Primer Login",
    "descripcion": "Completa tu primer inicio de sesión"
  },
  {
    "id": 2,
    "nombre": "Explorador",
    "descripcion": "Visita 10 páginas diferentes"
  }
]
~~~
💡 **Nota:** Los campos específicos de cada logro dependen de la estructura definida en el modelo `Achievement`.

### 📌 Errores
- **404 Not Found**: Si el usuario no existe en el sistema.
- **500 Internal Server Error**: En caso de error interno del servidor.

---

## 📉 2. Obtener Logros Pendientes y Progreso
**Método:** `GET`  
**URL:** `http://localhost:3000/achievements/unachieved-achievements/:id`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Parámetros en la ruta:
| Nombre  | Tipo  | Descripción                                |
|---------|-------|--------------------------------------------|
| `id`    | Number | ID del usuario cuyos logros pendientes se desean consultar. |

### 📌 Respuesta de la Petición
~~~json
{
  "percentage": 33.33,
  "achievements": [
    {
      "id": 3,
      "nombre": "Coleccionista",
      "descripcion": "Reúne 50 objetos"
    },
    {
      "id": 4,
      "nombre": "Social",
      "descripcion": "Agrega 5 amigos"
    }
  ]
}
~~~

### 📌 Explicación de Campos
| Campo        | Descripción                               |
|-------------|------------------------------------------|
| `percentage`| Porcentaje de logros completados         |
| `achievements`| Lista de logros no obtenidos por el usuario |

### 📌 Errores
- **404 Not Found**: Si el usuario no existe en el sistema.
- **500 Internal Server Error**: En caso de error interno del servidor.

---

## 🔧 Estructura Básica de un Logro
~~~json
{
  "id": "ID único numérico",
  "nombre": "Nombre del logro",
  "descripcion": "Descripción detallada",
  "dificultad": "Nivel de dificultad (Opcional)"
}
~~~

> **Importante:** Todas las rutas requieren autenticación previa y el ID debe corresponder a un usuario válido en el sistema.

---
## 📉 3. Desbloquear Logro
**Método:** `POST`  
**URL:** `http://localhost:3000/achievements/unlock-achievement`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Cuerpo de la peticion:
~~~json
{
    "user_id": "b3e1f74b-6c2a-4d98-8c4b-2e7f3a1d9e6d",
    "achievement_id": "2"
}
~~~

### 📌 Respuesta de la Petición
~~~json
 {"message": "Achievement unlocked"
  "newAchievement": "..."
 }
~~~

### 📌 Explicación de Campos
| Campo        | Descripción                               |
|-------------|------------------------------------------|
| `mensaje`| Mensaje que confirma el éxito         |
| `newAchievement`| Información del logro desbloqueado |

### 📌 Errores
- **404 Not Found**: Si el usuario no existe en el sistema.
- **500 Internal Server Error**: En caso de error interno del servidor.

---

> **Importante:** Todas las rutas requieren autenticación previa y el ID debe corresponder a un usuario válido en el sistema.

