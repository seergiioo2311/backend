# API de Pantalla Principal

Este documento describe los endpoints de la API relacionados con la información del usuario y las acciones que se realizan típicamente en una pantalla principal de usuario o página de perfil.

## Funcionalidad

La API de Pantalla Principal permite a los usuarios:

-   Recuperar su nombre de usuario utilizando su ID de usuario.
-   Recuperar su ID de usuario utilizando su nombre de usuario.
-   Actualizar su marca de tiempo de última conexión.
-   Actualizar la información de su perfil de usuario (nombre de usuario y/o contraseña).
-   Verificar su contraseña actual.

## Endpoints

Todos los endpoints tienen el prefijo `/main-screen`.

---

### 1. Obtener nombre de usuario por ID

-   **Endpoint:** `GET /get-user/:id`
-   **Descripción:** Recupera el nombre de usuario de un usuario dado su ID de usuario.
-   **Autenticación:** Se asume que es requerida (ej: el usuario debe haber iniciado sesión o ser un administrador).
-   **Parámetros de Solicitud (Request Parameters):**
    -   `id` (parámetro URL): El ID del usuario.
-   **Cuerpo de la Solicitud (Request Body):** Ninguno.
-   **Respuesta (Response):**
    -   **200 OK:**
        ```json
        {
            "username": "String (Nombre de usuario del usuario)"
        }
        ```
    -   **404 Not Found (No Encontrado):** Si el usuario no se encuentra.
        ```json
        {
            "message": "Ususario no encontrado"
        }
        ```
    -   **500 Internal Server Error (Error Interno del Servidor):**
        ```json
        {
            "message": "Mensaje de error"
        }
        ```

---

### 2. Obtener ID por nombre de usuario

-   **Endpoint:** `GET /get-id/:username`
-   **Descripción:** Recupera el ID de usuario de un usuario dado su nombre de usuario.
-   **Autenticación:** Se asume que es requerida (ej: el usuario debe haber iniciado sesión o ser un administrador).
-   **Parámetros de Solicitud:**
    -   `username` (parámetro URL): El nombre de usuario del usuario.
-   **Cuerpo de la Solicitud:** Ninguno.
-   **Respuesta:**
    -   **200 OK:**
        ```json
        {
            "id": "String (ID del usuario)"
        }
        ```
    -   **404 Not Found:** Si el usuario no se encuentra.
        ```json
        {
            "message": "Ususario no encontrado"
        }
        ```
    -   **500 Internal Server Error:**
        ```json
        {
            "message": "Mensaje de error"
        }
        ```

---

### 3. Actualizar marca de tiempo de conexión

-   **Endpoint:** `PUT /update-connection/:id`
-   **Descripción:** Actualiza la marca de tiempo `lastConnection` y establece `status` a verdadero para el usuario con el ID dado. Esto se llama típicamente cuando un usuario inicia sesión o realiza una acción que indica que está activo.
-   **Autenticación:** Se asume que es requerida (ej: el usuario debe haber iniciado sesión).
-   **Parámetros de Solicitud:**
    -   `id` (parámetro URL): El ID del usuario.
-   **Cuerpo de la Solicitud:** Ninguno.
-   **Respuesta:**
    -   **200 OK:**
        ```json
        {
            "message": "Usuario actualizado"
        }
        ```
    -   **404 Not Found:** Si el usuario no se encuentra (aunque la implementación actual del servicio podría devolver un error 500 a través de `error.message` si `updatedRows` o `connectionRows` es 0).
        ```json
        {
            "message": "Usuario no encontrado" 
        }
        ```
    -   **500 Internal Server Error:** Si hay un error durante la actualización.
        ```json
        {
            "message": "Mensaje de error (ej: 'Usuario no encontrado' si el servicio lanza un error)"
        }
        ```

---

### 4. Actualizar información del usuario

-   **Endpoint:** `PUT /update-user/:id`
-   **Descripción:** Permite a un usuario actualizar su nombre de usuario y/o contraseña.
-   **Autenticación:** Se asume que es requerida (ej: el usuario debe haber iniciado sesión y estar actualizando su propio perfil).
-   **Parámetros de Solicitud:**
    -   `id` (parámetro URL): El ID del usuario a actualizar.
-   **Cuerpo de la Solicitud:**
    ```json
    {
        "username": "String (Opcional, nuevo nombre de usuario)",
        "password": "String (Opcional, nueva contraseña)"
    }
    ```
    *Nota: Se debe proporcionar al menos uno de `username` o `password`.*
-   **Respuesta:**
    -   **200 OK:**
        ```json
        {
            "message": "OK"
        }
        ```
    -   **404 Not Found:** Si el usuario no se encuentra.
        ```json
        {
            "message": "Usuario no encontrado"
        }
        ```
    -   **500 Internal Server Error:** Si la actualización falla (ej: nombre de usuario ya tomado, error de base de datos, u otros problemas descritos por los mensajes del servicio como "Se requiere userId y al menos un campo de actualización (username o password)", "Login no encontrado", "El nombre de usuario ya está en uso").
        ```json
        {
            "message": "Mensaje de error específico (ej: 'El nombre de usuario ya está en uso')"
        }
        ```

---

### 5. Verificar contraseña

-   **Endpoint:** `PUT /verify-password/:id`
-   **Descripción:** Verifica la contraseña actual del usuario. Esto podría usarse antes de permitir operaciones sensibles como cambiar una dirección de email o eliminar una cuenta.
-   **Autenticación:** Se asume que es requerida (ej: el usuario debe haber iniciado sesión).
-   **Parámetros de Solicitud:**
    -   `id` (parámetro URL): El ID del usuario.
-   **Cuerpo de la Solicitud:**
    ```json
    {
        "password": "String (Contraseña actual a verificar)"
    }
    ```
-   **Respuesta:**
    -   **200 OK:** Si la contraseña es correcta.
        ```json
        {
            "message": "OK"
        }
        ```
    -   **404 Not Found:** Si el usuario no se encuentra.
        ```json
        {
            "message": "Usuario no encontrado"
        }
        ```
    -   **500 Internal Server Error:** Si la verificación de contraseña falla (ej: contraseña incorrecta, contraseña faltante, u otros problemas descritos por los mensajes del servicio como "Se requiere userId y password", "Loggin no encontrado", "Contraseña incorrecta").
        ```json
        {
            "message": "Mensaje de error específico (ej: 'Contraseña incorrecta')"
        }
        ```

---

## Nota de Autenticación:

Los fragmentos de código proporcionados para `mainScreenRoutes.js`, `mainScreenController.js` y `mainScreenService.js` no muestran explícitamente la implementación de verificaciones de autenticación o autorización. Se asume que dichos mecanismos de autenticación (ej: verificar que un usuario solo puede actualizar su propio perfil o que un administrador tiene los derechos apropiados) se manejan en otra parte de la aplicación (ej: en middleware global o un servicio de autenticación). Para un entorno de producción, asegurar que estos endpoints estén debidamente protegidos es crucial.

