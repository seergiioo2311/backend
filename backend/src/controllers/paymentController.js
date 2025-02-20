const stripe = require('../config/stripe');
const { sequelize_users } = require('../config/db');

/**
 * Procesa un pago con Stripe.
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
const processPayment = async (req, res) => {
    try {
        const { amount, currency, paymentMethodId } = req.body;

        if (!amount || !currency || !paymentMethodId) {
            return res.status(400).json({ error: 'Faltan parámetros requeridos' });
        }

        // Crear el pago con Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount, //Cantidad de dinero
            currency, //En que moneda se realiza el pago
            payment_method: paymentMethodId, //El method_id
            confirm: true, //Confirmar el pago inmediatamente
            automatic_payment_methods: {
                enabled: true, //Habilita métodos de pago automáticos
                allow_redirects: "never" // Deshabilita métodos de pago que requieren redirección
            }
        });

        res.json({ success: true, paymentIntent });
    } catch (error) {
        console.error('Error en el pago:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express. 
 */
const add_card = async (req, res) => {
    try {
        const { user, paymentMethodId } = req.body;

        if (!user || !paymentMethodId) {
            return res.status(400).json({ error: 'Usuario y método de pago son obligatorios.' });
        }

        // Vincular el método de pago al cliente en Stripe
        await stripe.paymentMethods.attach(paymentMethodId, { customer: user });

        // Establecer el método de pago como predeterminado para este cliente
        await stripe.customers.update(user, {
            invoice_settings: {
                default_payment_method: paymentMethodId
            }
        });

        // Actualizar en la base de datos
        await sequelize_users.update({ payment_method: paymentMethodId }, { where: { id: user } });

        res.status(200).json({ message: 'Método de pago añadido exitosamente.' });
    } 
    catch (error) {
        console.error('Error al registrar la tarjeta:', error);
        if (error.type === 'StripeCardError') {
            res.status(400).json({ error: 'Tarjeta rechazada. Verifica los datos.' });
        } else {
            res.status(500).json({ error: 'Error en el servidor. Inténtalo más tarde.' });
        }
    }
};


module.exports = { processPayment, add_card };