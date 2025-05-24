// Pruebas para las rutas de Pagos (paymentRoutes.js)

const request = require('supertest');
const express = require('express');
const paymentRoutes = require('../src/routes/paymentRoutes');
const stripe = require('../src/config/stripe'); // Para mockear Stripe
const { sequelize_loggin } = require('../src/config/db'); // Para mockear db sequelize_loggin.update

// Mockear Stripe y la base de datos
jest.mock('../src/config/stripe', () => ({
    paymentIntents: {
        create: jest.fn(),
    },
    paymentMethods: {
        attach: jest.fn(),
    },
    customers: {
        update: jest.fn(),
    },
}));

// Mockear solo la parte de sequelize_loggin que necesitamos
jest.mock('../src/config/db', () => {
    const originalDb = jest.requireActual('../src/config/db');
    return {
        ...originalDb, 
        sequelize_loggin: {
            update: jest.fn(),
        },
    };
});


const app = express();
app.use(express.json()); 
app.use('/payment', paymentRoutes); 

describe('Pruebas de API para Pagos', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    describe('POST /payment/pay', () => {
        const paymentData = {
            amount: 1000, // $10.00
            currency: 'usd',
            paymentMethodId: 'pm_card_visa'
        };

        it('debería devolver 400 si falta "amount"', async () => {
            const { amount, ...incompleteData } = paymentData;
            const res = await request(app).post('/payment/pay').send(incompleteData);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Faltan parámetros requeridos');
        });

        it('debería devolver 400 si falta "currency"', async () => {
            const { currency, ...incompleteData } = paymentData;
            const res = await request(app).post('/payment/pay').send(incompleteData);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Faltan parámetros requeridos');
        });

        it('debería devolver 400 si falta "paymentMethodId"', async () => {
            const { paymentMethodId, ...incompleteData } = paymentData;
            const res = await request(app).post('/payment/pay').send(incompleteData);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Faltan parámetros requeridos');
        });

        it('debería devolver 500 si Stripe paymentIntents.create lanza un error', async () => {
            const stripeErrorMessage = 'Error de Stripe creando el intento de pago';
            stripe.paymentIntents.create.mockRejectedValue(new Error(stripeErrorMessage));
            const res = await request(app).post('/payment/pay').send(paymentData);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('error', stripeErrorMessage);
        });
    });

    describe('POST /payment/add_card', () => {
        const addCardData = {
            user: 'cus_testcustomer123', // Stripe Customer ID
            paymentMethodId: 'pm_newcard_visa'
        };

        it('debería añadir una tarjeta exitosamente y devolver 200', async () => {
            stripe.paymentMethods.attach.mockResolvedValue({}); // Simula éxito
            stripe.customers.update.mockResolvedValue({}); // Simula éxito
            sequelize_loggin.update.mockResolvedValue([1]); // Simula una fila actualizada

            const res = await request(app)
                .post('/payment/add_card')
                .send(addCardData);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ message: 'Método de pago añadido exitosamente.' });
            expect(stripe.paymentMethods.attach).toHaveBeenCalledWith(addCardData.paymentMethodId, { customer: addCardData.user });
            expect(stripe.customers.update).toHaveBeenCalledWith(addCardData.user, {
                invoice_settings: { default_payment_method: addCardData.paymentMethodId }
            });
            expect(sequelize_loggin.update).toHaveBeenCalledWith(
                { payment_method: addCardData.paymentMethodId },
                { where: { id: addCardData.user } } // Asumiendo que el 'user' ID es el mismo para la DB local
            );
        });

        it('debería devolver 400 si falta "user"', async () => {
            const { user, ...incompleteData } = addCardData;
            const res = await request(app)
                .post('/payment/add_card')
                .send(incompleteData);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Usuario y método de pago son obligatorios.');
        });

        it('debería devolver 400 si falta "paymentMethodId"', async () => {
            const { paymentMethodId, ...incompleteData } = addCardData;
            const res = await request(app)
                .post('/payment/add_card')
                .send(incompleteData);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Usuario y método de pago son obligatorios.');
        });

        it('debería devolver 500 si stripe.paymentMethods.attach lanza un error', async () => {
            const attachError = new Error('Error al adjuntar método de pago');
            stripe.paymentMethods.attach.mockRejectedValue(attachError);

            const res = await request(app)
                .post('/payment/add_card')
                .send(addCardData);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('error', 'Error en el servidor. Inténtalo más tarde.');
        });
        
        it('debería devolver 400 si stripe.paymentMethods.attach lanza un StripeCardError', async () => {
            const cardError = new Error('La tarjeta fue rechazada.');
            cardError.type = 'StripeCardError'; // Así lo identifica el controlador
            stripe.paymentMethods.attach.mockRejectedValue(cardError);

            const res = await request(app)
                .post('/payment/add_card')
                .send(addCardData);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Tarjeta rechazada. Verifica los datos.');
        });


        it('debería devolver 500 si stripe.customers.update lanza un error', async () => {
            stripe.paymentMethods.attach.mockResolvedValue({}); // Attach funciona
            const updateError = new Error('Error al actualizar cliente de Stripe');
            stripe.customers.update.mockRejectedValue(updateError);

            const res = await request(app)
                .post('/payment/add_card')
                .send(addCardData);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('error', 'Error en el servidor. Inténtalo más tarde.');
        });

        it('debería devolver 500 si sequelize_loggin.update lanza un error', async () => {
            stripe.paymentMethods.attach.mockResolvedValue({});
            stripe.customers.update.mockResolvedValue({});
            const dbError = new Error('Error de base de datos al actualizar');
            sequelize_loggin.update.mockRejectedValue(dbError);

            const res = await request(app)
                .post('/payment/add_card')
                .send(addCardData);
            expect(res.statusCode).toEqual(500);
            // El controlador actual envuelve el error de DB en un mensaje genérico
            expect(res.body).toHaveProperty('error', 'Error en el servidor. Inténtalo más tarde.');
        });
    });
});

