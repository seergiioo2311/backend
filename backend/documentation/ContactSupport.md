# API de Soporte de Contacto

Este documento describe los endpoints de la API para gestionar mensajes de soporte de contacto y funcionalidades de usuario relacionadas.

## Funcionalidad

La API de Soporte de Contacto permite a los usuarios:

-   Enviar nuevos mensajes de soporte.
-   Ver todos los mensajes de soporte (administrador).
-   Ver un mensaje de soporte específico por su ID (administrador).
-   Responder a un mensaje de soporte (administrador).
-   Ver mensajes de soporte no resueltos (administrador).
-   Ver mensajes de soporte resueltos (administrador).
-   Ver mensajes de soporte por tipo (administrador).
-   Eliminar un mensaje de soporte (administrador).
-   Eliminar un usuario (administrador).
-   Buscar usuarios por nombre de usuario (administrador).
-   Obtener el número total de usuarios registrados (administrador).

## Endpoints

Todos los endpoints tienen el prefijo `/contact-support`.

---

### 1. Crear un nuevo mensaje

-   **Endpoint:** `POST /new`
-   **Descripción:** Permite a un usuario enviar un nuevo mensaje de soporte.
-   **Autenticación:** No requerida.
-   **Cuerpo de la Solicitud (Request Body):**
    ```json
    {
        "title": "String (Título)",
        "email": "String (Formato de email)",
        "name": "String (Nombre)",
        "description": "String (Descripción)",
        "type": "String (Ej: 'Consulta General', 'Soporte Técnico', 'Reporte de Bug')"
    }
    ```
-   **Respuesta (Response):**
    -   **201 Created (Creado):**
        ```json
        {
            "id": "Integer (Entero)",
            "title": "String (Título)",
            "email": "String (Email)",
            "name": "String (Nombre)",
            "description": "String (Descripción)",
            "type": "String (Tipo)",
            "resolved": "Boolean (false - falso)",
            "response": null,
            "createdAt": "Timestamp (Marca de tiempo)",
            "updatedAt": "Timestamp (Marca de tiempo)"
        }
        ```
    -   **404 Not Found (No Encontrado):** Si hay un error creando el mensaje.
        ```json
        {
            "message": "Error creando el mensaje"
        }
        ```
    -   **500 Internal Server Error (Error Interno del Servidor):**
        ```json
        {
            "message": "Mensaje de error"
        }
        ```

---

### 2. Obtener todos los mensajes

-   **Endpoint:** `GET /all`
-   **Descripción:** Recupera todos los mensajes de soporte. Destinado para uso de administradores.
-   **Autenticación:** Se requieren privilegios de administrador.
-   **Cuerpo de la Solicitud:** Ninguno.
-   **Respuesta:**
    -   **200 OK:**
        ```json
        [
            {
                "id": "Integer",
                "title": "String",
                "email": "String",
                "name": "String",
                "description": "String",
                "type": "String",
                "resolved": "Boolean",
                "response": "String (o null)",
                "createdAt": "Timestamp",
                "updatedAt": "Timestamp"
            },
            ...
        ]
        ```
    -   **404 Not Found:** Si hay un error recuperando los mensajes.
        ```json
        {
            "message": "Error obteniendo los mensajes"
        }
        ```
    -   **500 Internal Server Error:**
        ```json
        {
            "message": "Mensaje de error"
        }
        ```

---

### 3. Obtener mensaje por ID

-   **Endpoint:** `GET /getMessageById/:id`
-   **Descripción:** Recupera un mensaje de soporte específico por su ID. Destinado para uso de administradores.
-   **Autenticación:** Se requieren privilegios de administrador.
-   **Parámetros de Solicitud (Request Parameters):**
    -   `id` (parámetro URL): El ID del mensaje a recuperar.
-   **Cuerpo de la Solicitud:** Ninguno.
-   **Respuesta:**
    -   **200 OK:**
        ```json
        {
            "id": "Integer",
            "title": "String",
            "email": "String",
            "name": "String",
            "description": "String",
            "type": "String",
            "resolved": "Boolean",
            "response": "String (o null)",
            "createdAt": "Timestamp",
            "updatedAt": "Timestamp"
        }
        ```
    -   **404 Not Found:** Si el mensaje no se encuentra o hay un error.
        ```json
        {
            "message": "Error obteniendo el mensaje"
        }
        ```
    -   **500 Internal Server Error:**
        ```json
        {
            "message": "Mensaje de error"
        }
        ```

---

### 4. Responder a un mensaje

-   **Endpoint:** `POST /response/:id`
-   **Descripción:** Permite a un administrador responder a un mensaje de soporte. Esto también marca el mensaje como resuelto y envía una notificación por email al usuario.
-   **Autenticación:** Se requieren privilegios de administrador.
-   **Parámetros de Solicitud:**
    -   `id` (parámetro URL): El ID del mensaje al que se va a responder.
-   **Cuerpo de la Solicitud:**
    ```json
    {
        "response": "String (La respuesta del administrador)"
    }
    ```
-   **Respuesta:**
    -   **200 OK:**
        ```json
        {
            "id": "Integer",
            "title": "String",
            "email": "String",
            "name": "String",
            "description": "String",
            "type": "String",
            "resolved": "Boolean (true - verdadero)",
            "response": "String (La respuesta del administrador)",
            "createdAt": "Timestamp",
            "updatedAt": "Timestamp"
        }
        ```
    -   **400 Bad Request (Solicitud Incorrecta):** Si no se proporciona `id` o `response`.
        ```json
        {
            "message": "Error, id no proporcionado" 
        }
        // o
        {
            "message": "Error, respuesta no proporcionada"
        }
        ```
    -   **404 Not Found:** Si el mensaje no se encuentra o hay un error al actualizarlo.
        ```json
        {
            "message": "Error resolviendo el mensaje"
        }
        ```
    -   **500 Internal Server Error:**
        ```json
        {
            "message": "Mensaje de error"
        }
        ```

---

### 5. Obtener mensajes no resueltos

-   **Endpoint:** `GET /unresolved`
-   **Descripción:** Recupera todos los mensajes de soporte que aún no han sido resueltos. Destinado para uso de administradores.
-   **Autenticación:** Se requieren privilegios de administrador.
-   **Cuerpo de la Solicitud:** Ninguno.
-   **Respuesta:**
    -   **200 OK:**
        ```json
        [
            {
                "id": "Integer",
                "title": "String",
                "email": "String",
                "name": "String",
                "description": "String",
                "type": "String",
                "resolved": "Boolean (false)",
                "response": null,
                "createdAt": "Timestamp",
                "updatedAt": "Timestamp"
            },
            ...
        ]
        ```
    -   **404 Not Found:** Si hay un error recuperando los mensajes.
        ```json
        {
            "message": "Error obteniendo los mensajes"
        }
        ```
    -   **500 Internal Server Error:**
        ```json
        {
            "message": "Mensaje de error"
        }
        ```

---

### 6. Obtener mensajes resueltos

-   **Endpoint:** `GET /resolved`
-   **Descripción:** Recupera todos los mensajes de soporte que han sido resueltos. Destinado para uso de administradores.
-   **Autenticación:** Se requieren privilegios de administrador.
-   **Cuerpo de la Solicitud:** Ninguno.
-   **Respuesta:**
    -   **200 OK:**
        ```json
        [
            {
                "id": "Integer",
                "title": "String",
                "email": "String",
                "name": "String",
                "description": "String",
                "type": "String",
                "resolved": "Boolean (true)",
                "response": "String",
                "createdAt": "Timestamp",
                "updatedAt": "Timestamp"
            },
            ...
        ]
        ```
    -   **404 Not Found:** Si hay un error recuperando los mensajes.
        ```json
        {
            "message": "Error obteniendo los mensajes"
        }
        ```
    -   **500 Internal Server Error:**
        ```json
        {
            "message": "Mensaje de error"
        }
        ```

---

### 7. Obtener mensajes por tipo

-   **Endpoint:** `GET /type/:type`
-   **Descripción:** Recupera todos los mensajes de soporte de un tipo específico. Destinado para uso de administradores.
-   **Autenticación:** Se requieren privilegios de administrador.
-   **Parámetros de Solicitud:**
    -   `type` (parámetro URL): El tipo de mensaje a recuperar (ej: 'Consulta General').
-   **Cuerpo de la Solicitud:** Ninguno.
-   **Respuesta:**
    -   **200 OK:**
        ```json
        [
            {
                "id": "Integer",
                "title": "String",
                "email": "String",
                "name": "String",
                "description": "String",
                "type": "String",
                "resolved": "Boolean",
                "response": "String (o null)",
                "createdAt": "Timestamp",
                "updatedAt": "Timestamp"
            },
            ...
        ]
        ```
    -   **404 Not Found:** Si hay un error recuperando los mensajes.
        ```json
        {
            "message": "Error obteniendo los mensajes"
        }
        ```
    -   **500 Internal Server Error:**
        ```json
        {
            "message": "Mensaje de error"
        }
        ```

---

### 8. Eliminar un mensaje

-   **Endpoint:** `DELETE /delete/:id`
-   **Descripción:** Elimina un mensaje de soporte específico por su ID. Destinado para uso de administradores.
-   **Autenticación:** Se requieren privilegios de administrador.
-   **Parámetros de Solicitud:**
    -   `id` (parámetro URL): El ID del mensaje a eliminar.
-   **Cuerpo de la Solicitud:** Ninguno.
-   **Respuesta:**
    -   **200 OK:**
        ```json
        {
            "id": "Integer",
            "title": "String",
            "email": "String",
            // ... (otros campos del mensaje eliminado)
        }
        ```
    -   **404 Not Found:** Si el mensaje no se encuentra o hay un error al eliminarlo.
        ```json
        {
            "message": "Error eliminando el mensaje"
        }
        ```
    -   **500 Internal Server Error:**
        ```json
        {
            "message": "Mensaje de error"
        }
        ```

---

### 9. Eliminar un usuario

-   **Endpoint:** `POST /delete-user/:id`
-   **Descripción:** Elimina un usuario por su ID. Envía una notificación por email al usuario sobre la eliminación de la cuenta. Destinado para uso de administradores.
-   **Autenticación:** Se requieren privilegios de administrador.
-   **Parámetros de Solicitud:**
    -   `id` (parámetro URL): El ID del usuario a eliminar.
-   **Cuerpo de la Solicitud:**
    ```json
    {
        "motive": "String (Razón para la eliminación del usuario)",
        "email": "String (Email del usuario para la notificación)"
    }
    ```
-   **Respuesta:**
    -   **200 OK:**
        ```json
        {
            "id": "Integer",
            "username": "String",
            // ... (otros campos del usuario eliminado)
        }
        ```
    -   **404 Not Found:** Si no se proporciona `id`, `motive`, o `email`, o si el usuario no se encuentra, o si hay un error al eliminar el usuario.
        ```json
        {
            "message": "Error, id no proporcionado" 
        }
        // o
        {
            "message": "Error, motivo no proporcionado"
        }
        // o
        {
            "message": "Error, email no proporcionado"
        }
        // o
        {
            "message": "Error, usuario no encontrado"
        }
        // o
        {
            "message": "Error eliminando el usuario"
        }
        ```
    -   **500 Internal Server Error:**
        ```json
        {
            "message": "Mensaje de error"
        }
        ```

---

### 10. Obtener usuarios por nombre de usuario (búsqueda)

-   **Endpoint:** `GET /get-users/:username`
-   **Descripción:** Recupera usuarios cuyo nombre de usuario contiene la cadena de búsqueda proporcionada. También incluye el email del usuario desde la tabla `Logging`. Destinado para uso de administradores.
-   **Autenticación:** Se requieren privilegios de administrador.
-   **Parámetros de Solicitud:**
    -   `username` (parámetro URL): La cadena de búsqueda para nombres de usuario.
-   **Cuerpo de la Solicitud:** Ninguno.
-   **Respuesta:**
    -   **200 OK:**
        ```json
        [
            {
                "id": "Integer",
                "username": "String",
                "role": "String",
                "createdAt": "Timestamp",
                "updatedAt": "Timestamp",
                "email": "String (o null si no se encuentra en Logging)"
            },
            ...
        ]
        ```
    -   **404 Not Found:** Si hay un error recuperando usuarios.
        ```json
        {
            "message": "Error obteniendo los usuarios"
        }
        ```
    -   **500 Internal Server Error:**
        ```json
        {
            "message": "Mensaje de error"
        }
        ```

---

### 11. Obtener número de usuarios

-   **Endpoint:** `GET /get-num-users`
-   **Descripción:** Recupera el número total de usuarios registrados. Destinado para uso de administradores.
-   **Autenticación:** Se requieren privilegios de administrador.
-   **Cuerpo de la Solicitud:** Ninguno.
-   **Respuesta:**
    -   **200 OK:**
        ```json
        "Integer (Número de usuarios)"
        ```
    -   **404 Not Found:** Si hay un error recuperando la cuenta.
        ```json
        {
            "message": "Error obteniendo el número de usuarios"
        }
        ```
    -   **500 Internal Server Error:**
        ```json
        {
            "message": "Mensaje de error"
        }
        ```

---

## Nota de Autenticación:
Aunque la documentación para cada endpoint especifica "Se requieren privilegios de administrador" para ciertas rutas, los fragmentos de código proporcionados para `contactSupportRoutes.js`, `contactSupportController.js` y `contactSupportService.js` no muestran explícitamente la implementación de verificaciones de autenticación o autorización (ej: middleware que verifique roles de administrador). Se asume que dichos mecanismos de autenticación se manejan en otra parte de la aplicación (ej: en un middleware global o un servicio de autenticación). Para un entorno de producción, asegurar que estos endpoints estén debidamente protegidos es crucial.
