# API de Pagos

Este documento describe los endpoints de la API para procesar pagos y gestionar métodos de pago utilizando Stripe.

## Funcionalidad

La API de Pagos permite a los usuarios:

-   Procesar un pago por un monto y moneda especificados.
-   Añadir un nuevo método de pago (tarjeta) a un cliente y establecerlo como predeterminado.

## Endpoints

Todos los endpoints tienen el prefijo `/payment`.

---

### 1. Procesar Pago

-   **Endpoint:** `POST /pay`
-   **Descripción:** Procesa un pago utilizando un ID de método de pago proporcionado.
-   **Autenticación:** Se asume que es requerida (ej: el usuario debe haber iniciado sesión).
-   **Cuerpo de la Solicitud (Request Body):**
    ```json
    {
        "amount": "Integer (Monto en centavos, ej: 1000 para $10.00)",
        "currency": "String (Código de moneda, ej: 'usd')",
        "paymentMethodId": "String (ID de PaymentMethod de Stripe)"
    }
    ```
-   **Respuesta (Response):**
    -   **200 OK:** Si el pago es exitoso.
        ```json
        {
            "success": true,
            "paymentIntent": {
                // Objeto PaymentIntent de Stripe
                "id": "pi_...",
                "amount": "Integer (Monto)",
                "currency": "String (Moneda)",
                "status": "String (ej: 'succeeded' - exitoso)",
                // ... otros campos de PaymentIntent
            }
        }
        ```
    -   **400 Bad Request (Solicitud Incorrecta):** Si faltan parámetros requeridos.
        ```json
        {
            "error": "Faltan parámetros requeridos"
        }
        ```
    -   **500 Internal Server Error (Error Interno del Servidor):** Si hay un error durante el procesamiento del pago.
        ```json
        {
            "error": "Mensaje de error de Stripe o del servidor"
        }
        ```

---

### 2. Añadir Tarjeta

-   **Endpoint:** `POST /add_card`
-   **Descripción:** Añade un nuevo método de pago (tarjeta) a un cliente de Stripe, lo establece como su método de pago predeterminado y actualiza el `payment_method` en la base de datos local (`sequelize_loggin`).
-   **Autenticación:** Se asume que es requerida (ej: el usuario debe haber iniciado sesión). El campo `user` en el cuerpo de la solicitud probablemente se refiere a un ID de Cliente de Stripe (Stripe Customer ID), que debería estar asociado con el usuario que ha iniciado sesión.
-   **Cuerpo de la Solicitud:**
    ```json
    {
        "user": "String (ID de Cliente de Stripe)",
        "paymentMethodId": "String (ID de PaymentMethod de Stripe de la nueva tarjeta)"
    }
    ```
-   **Respuesta:**
    -   **200 OK:** Si la tarjeta se añade exitosamente.
        ```json
        {
            "message": "Método de pago añadido exitosamente."
        }
        ```
    -   **400 Bad Request:**
        - Si faltan `user` o `paymentMethodId`:
            ```json
            {
                "error": "Usuario y método de pago son obligatorios."
            }
            ```
        - Si la tarjeta es rechazada por Stripe (StripeCardError):
            ```json
            {
                "error": "Tarjeta rechazada. Verifica los datos."
            }
            ```
    -   **500 Internal Server Error:** Si hay cualquier otro error durante el proceso.
        ```json
        {
            "error": "Error en el servidor. Inténtalo más tarde."
        }
        ```

---
