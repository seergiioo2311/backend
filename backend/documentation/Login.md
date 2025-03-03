# 📌 API Documentation Login y Pagos

Esta API permite la autenticación de usuarios, recuperación de contraseña y pagos con un unico metodo de pago por usuario.

---

## 🔑 1. Iniciar Sesión
**Método:** `POST`  
**URL:** `http://localhost:3000/auth/sign-in`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Cuerpo de la petición:
~~~json
{
  "email": "test@test.com",
  "password": "test"
}
~~~

### Respuesta de la Peticion
~~~json
{"message":"Inicio de Sesión Correcto","accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJpdmFuZGV6YWRAZ21haWwuY29tIiwiaWF0IjoxNzQxMDIyNDA1LCJleHAiOjE3NDEwMjk2MDV9.FAqyoSUN8R9IwzlrPzN35iHQP91H8keAxMvau48nlGA","refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJpdmFuZGV6YWRAZ21haWwuY29tIiwiaWF0IjoxNzQxMDIyNDA1LCJleHAiOjE3NDE2MjcyMDV9.3W9rw8J6GN50RSZ7E2vukqUb7tQQGNjTxVyGDE1iZJo"}
~~~

---

## 🆕 2. Crear Cuenta
**Método:** `POST`  
**URL:** `http://localhost:3000/auth/sign-up`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Cuerpo de la petición:
~~~json
{
  "username": "Deza_Test",
  "email": "ivandezad@gmail.com",
  "password": "123456789"
}
~~~

### 📌Respuesta de la Peticion
~~~json
{
    "message": "Usuario creado con éxito",
    "user": {"username": "Deza_Test", "email": "ivandezad@gmail.com "}
}
~~~

---

## 🔄 3. Recuperar Contraseña - Pedir Código
**Método:** `POST`  
**URL:** `http://localhost:3000/auth/forgot-password`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Cuerpo de la petición:
~~~json
{
  "email": "ivandezad@gmail.com"
}
~~~

### Respuesta de la Peticion
~~~json
{"message":"Correo de recuperación enviado con éxito"}
~~~

---

## 📩 4. Recuperar Contraseña - Obtener Formulario
**Método:** `POST`  
**URL:**
`http://localhost:3000/auth/reset-password/7ddaa257c2edf93ed30fc49864c41057a7986b0bc655f3c0a812b469b9f8bf03`

💡 **Nota:** Este paso se realiza en el frontend.

---

## 🔑 5. Recuperar Contraseña - Enviar Nueva Contraseña
**Método:** `POST`  
**URL:**
`http://localhost:3000/auth/reset-password/71dd29862a3751d46bea6b2c316435da1fb800185c075e18e2f5ac2fc7aa3fae`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Cuerpo de la petición:
~~~json
{
  "newPassword": "nuevaClave123"
}
~~~

### Respuesta de la Peticion
~~~json
{
    "message":"Contraseña actualizada con éxito"
}

---

## 💳 6. Pagar con Método de Pago
**Método:** `POST`  
**URL:** `http://localhost:3000/payment/pay`  

### 📌 Headers:
| Clave        | Valor               |
|-------------|--------------------|
| Content-Type | application/json  |

### 📌 Cuerpo de la petición:
~~~json
{
  "amount": 90000000,
  "currency": "usd",
  "paymentMethodId": "pm_card_visa"
}
~~~

### Respuesta de la Peticion
~~~json
{"success":true,"paymentIntent":{"id":"pi_3QycaEE4oCRS9kfz01hnIVPm","object":"payment_intent","amount":90000000,"amount_capturable":0,"amount_details":{"tip":{}},"amount_received":90000000,"application":null,"application_fee_amount":null,"automatic_payment_methods":{"allow_redirects":"never","enabled":true},"canceled_at":null,"cancellation_reason":null,"capture_method":"automatic_async","client_secret":"pi_3QycaEE4oCRS9kfz01hnIVPm_secret_mRRKQlE25i2RLj5RRYOfxwFmh","confirmation_method":"automatic","created":1741022114,"currency":"usd","customer":null,"description":null,"invoice":null,"last_payment_error":null,"latest_charge":"ch_3QycaEE4oCRS9kfz0KunnGFm","livemode":false,"metadata":{},"next_action":null,"on_behalf_of":null,"payment_method":"pm_1QycaEE4oCRS9kfzZukBKjPC","payment_method_configuration_details":{"id":"pmc_1QrelFE4oCRS9kfzbrndra5K","parent":null},"payment_method_options":{"card":{"installments":null,"mandate_options":null,"network":null,"request_three_d_secure":"automatic"},"link":{"persistent_token":null}},"payment_method_types":["card","link"],"processing":null,"receipt_email":null,"review":null,"setup_future_usage":null,"shipping":null,"source":null,"statement_descriptor":null,"statement_descriptor_suffix":null,"status":"succeeded","transfer_data":null,"transfer_group":null}
~~~

