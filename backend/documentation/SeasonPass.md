# API de Pase de Temporada

Este documento describe los endpoints de la API relacionados con la funcionalidad del pase de temporada, incluyendo la recuperación de ítems, la progresión del usuario (nivel y experiencia) y la posesión del pase de temporada.

## Funcionalidad

La API de Pase de Temporada permite a los usuarios:

-   Obtener todos los ítems asociados con un pase de temporada específico, indicando cuáles están desbloqueados/reclamados por un usuario.
-   Obtener todos los ítems asociados con niveles generales del juego, indicando cuáles están desbloqueados/reclamados por un usuario.
-   Obtener el nivel actual del pase de temporada de un usuario.
-   Obtener los puntos de experiencia actuales de un usuario.
-   Obtener el total de puntos de experiencia requeridos para alcanzar un nivel específico.
-   Verificar si un usuario ha comprado/desbloqueado un pase de temporada específico.

## Endpoints

Todos los endpoints tienen el prefijo `/season-pass`. Nótese que algunas rutas en el código fuente tienen `/season-pass` duplicado (ej: `/season-pass/season-pass/getItemsFromSeasonPass/...`). La documentación reflejará la ruta real definida en `seasonPassRoutes.js`.

---

### 1. Obtener Ítems del Pase de Temporada

-   **Endpoint:** `GET /season-pass/getItemsFromSeasonPass/:idUser/:idSeasonPass`
-   **Descripción:** Recupera todos los ítems pertenecientes a un pase de temporada específico, junto con su estado de desbloqueo y reclamación para el usuario dado.
-   **Autenticación:** Se asume que es requerida (ej: el usuario debe haber iniciado sesión).
-   **Parámetros de Solicitud (Request Parameters):**
    -   `idUser` (parámetro URL): El ID del usuario.
    -   `idSeasonPass` (parámetro URL): El ID del pase de temporada.
-   **Cuerpo de la Solicitud (Request Body):** Ninguno.
-   **Respuesta (Response):**
    -   **200 OK:**
        ```json
        [
            {
                "level_required": "Integer (Entero - Nivel requerido)",
                "unlocked": "Boolean (Booleano - Desbloqueado)",
                "reclaimed": "Boolean (Booleano - Reclamado)",
                "id": "Integer (ID del Ítem)",
                "name": "String (Nombre del Ítem)",
                "type": "String (Tipo de Ítem)"
            },
            // ... más ítems
        ]
        ```
    -   **404 Not Found (No Encontrado):**
        - Si el usuario no se encuentra: `{"message": "Usuario no encontrado."}`
        - Si el pase de temporada no se encuentra: `{"message": "Pase de temporada no encontrado."}`
        - Si no se encuentran ítems para el pase de temporada: `{"message": "No se han encontrado items."}`
    -   **500 Internal Server Error (Error Interno del Servidor):** `{"message": "Mensaje de error"}`

---

### 2. Obtener Ítems de Niveles

-   **Endpoint:** `GET /season-pass/getItemsFromLevels/:idUser`
-   **Descripción:** Recupera todos los ítems que se desbloquean a través de niveles generales del juego, junto con su estado de desbloqueo y reclamación para el usuario dado.
-   **Autenticación:** Se asume que es requerida (ej: el usuario debe haber iniciado sesión).
-   **Parámetros de Solicitud:**
    -   `idUser` (parámetro URL): El ID del usuario.
-   **Cuerpo de la Solicitud:** Ninguno.
-   **Respuesta:**
    -   **200 OK:**
        ```json
        [
            {
                "id_level": "Integer (ID de Nivel)",
                "unlocked": "Boolean",
                "reclaimed": "Boolean",
                "id": "Integer (ID del Ítem)",
                "name": "String (Nombre del Ítem)",
                "type": "String (Tipo de Ítem)"
            },
            // ... más ítems
        ]
        ```
    -   **404 Not Found:**
        - Si el usuario no se encuentra: `{"message": "Usuario no encontrado."}`
        - Si no se encuentran ítems: `{"message": "No se han encontrado items."}`
    -   **500 Internal Server Error:** `{"message": "Mensaje de error"}`

---

### 3. Obtener Nivel del Usuario

-   **Endpoint:** `GET /season-pass/getUserLevel/:idUser`
-   **Descripción:** Recupera el nivel actual del pase de temporada para el usuario especificado.
-   **Autenticación:** Se asume que es requerida.
-   **Parámetros de Solicitud:**
    -   `idUser` (parámetro URL): El ID del usuario.
-   **Cuerpo de la Solicitud:** Ninguno.
-   **Respuesta:**
    -   **200 OK:**
        ```json
        {
            "level": "Integer (Nivel actual del usuario)"
        }
        ```
    -   **404 Not Found:**
        - Si el usuario no se encuentra: `{"message": "Usuario no encontrado."}`
        - Si la información del nivel del usuario no se encuentra: `{"message": "No se ha podido obtener el nivel del usuario."}` (o `{"message": "No se ha encontrado el nivel del usuario"}` del servicio)
    -   **500 Internal Server Error:** `{"message": "Mensaje de error"}`

---

### 4. Obtener Experiencia del Usuario

-   **Endpoint:** `GET /season-pass/getUserExperience/:idUser`
-   **Descripción:** Recupera los puntos de experiencia actuales para el usuario especificado.
-   **Autenticación:** Se asume que es requerida.
-   **Parámetros de Solicitud:**
    -   `idUser` (parámetro URL): El ID del usuario.
-   **Cuerpo de la Solicitud:** Ninguno.
-   **Respuesta:**
    -   **200 OK:**
        ```json
        {
            "experience": "Integer (Puntos de experiencia actuales del usuario)"
        }
        ```
    -   **404 Not Found:**
        - Si el usuario no se encuentra: `{"message": "Usuario no encontrado."}`
        - Si la información de la experiencia del usuario no se encuentra: `{"message": "No se ha podido obtener la experiencia del usuario."}` (o `{"message": "No se ha encontrado la experiencia del usuario"}` del servicio)
    -   **500 Internal Server Error:** `{"message": "Mensaje de error"}`

---

### 5. Obtener Experiencia para el Siguiente Nivel

-   **Endpoint:** `GET /season-pass/getExperienceToNextLevel/:level`
-   **Descripción:** Recupera la cantidad total de puntos de experiencia requeridos para alcanzar el nivel especificado.
-   **Autenticación:** Ninguna mencionada explícitamente, probablemente información pública.
-   **Parámetros de Solicitud:**
    -   `level` (parámetro URL): El número de nivel objetivo.
-   **Cuerpo de la Solicitud:** Ninguno.
-   **Respuesta:**
    -   **200 OK:**
        ```json
        {
            "experience": "Integer (Puntos de experiencia requeridos para el nivel especificado)"
        }
        ```
    -   **404 Not Found:** Si la definición del nivel no se encuentra: `{"message": "No se ha podido obtener la experiencia necesaria para el siguiente nivel."}` (o `{"message": "Nivel no encontrado"}` del servicio)
    -   **500 Internal Server Error:** `{"message": "Mensaje de error"}`

---

### 6. Verificar si el Usuario Tiene el Pase de Temporada

-   **Endpoint:** `GET /season-pass/hasUserSP/:idUser/:idSeasonPass`
-   **Descripción:** Verifica si el usuario especificado ha comprado o desbloqueado el pase de temporada especificado.
-   **Autenticación:** Se asume que es requerida.
-   **Parámetros de Solicitud:**
    -   `idUser` (parámetro URL): El ID del usuario.
    -   `idSeasonPass` (parámetro URL): El ID del pase de temporada.
-   **Cuerpo de la Solicitud:** Ninguno.
-   **Respuesta:**
    -   **200 OK:**
        ```json
        {
            "unlocked": "Boolean (Verdadero si el usuario tiene el pase de temporada, falso en caso contrario)"
        }
        ```
    -   **404 Not Found:**
        - Si el usuario o el pase de temporada no se encuentra: `{"message": "Usuario o pase de temporada no encontrado."}`
        - Si la información de posesión no puede ser determinada: `{"message": "No se ha si el usuario ha desbloqueado el pase de pago."}` (o `{"message": "Usuario no encontrado"}` del servicio si la entrada `SP_for_user` no existe)
    -   **500 Internal Server Error:** `{"message": "Mensaje de error"}`

---

## Nota de Autenticación:

Los fragmentos de código proporcionados no detallan explícitamente los mecanismos de autenticación. Se asume que la autenticación y autorización del usuario (ej: asegurar que un usuario solo pueda consultar sus propios datos cuando sea apropiado) se manejan en otras partes de la aplicación. Para un entorno de producción, las medidas de seguridad adecuadas son esenciales.

## Nota sobre Prefijos de Ruta:

Las rutas definidas en `seasonPassRoutes.js` comienzan todas con `/season-pass/`. Esto significa que las llamadas reales a la API se verán como `/api/season-pass/season-pass/endpoint...` si el enrutador principal monta `seasonPassRoutes` bajo `/api/season-pass`. Esta documentación refleja las rutas tal como están definidas en el archivo `seasonPassRoutes.js`. Considere una posible consolidación de prefijos de ruta para mayor claridad si aplica.

