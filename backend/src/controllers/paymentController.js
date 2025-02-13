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

const add_card = async (req, res) => {
    try {
        const {user ,card_number, exp_month, exp_year, cvc} = req.body;

        //Creamos el metodo de pago
        const pay_method = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: card_number,
                exp_month: exp_month,
                exp_year: exp_year,
                cvc: cvc
            }
        });
        await stripe.paymentMethods.attach(pay_method.id, {customer: user});
        sequelize_users.update({payment_method: pay_method.id}, {where: {id: user}});
    } 
    catch(error) {
        console.error('Error al registrar la tarjeta:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { processPayment };