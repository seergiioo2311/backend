const stripe = require('../config/stripe');

/**
 * Procesa un pago con Stripe.
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
const processPayment = async (req, res) => {
    try {
        console.log(stripe.paymentIntents); // Debe imprimir un objeto, NO "undefined"
        const { amount, currency, paymentMethodId } = req.body;

        if (!amount || !currency || !paymentMethodId) {
            return res.status(400).json({ error: 'Faltan parámetros requeridos' });
        }

        // Crear el pago con Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never" // Deshabilita métodos de pago que requieren redirección
            }
        });

        res.json({ success: true, paymentIntent });
    } catch (error) {
        console.error('Error en el pago:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { processPayment };