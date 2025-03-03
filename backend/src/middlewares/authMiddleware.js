const jwt = require("jsonwebtoken");

const rutasPublicas = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password", "/refresh-token" ]

/**
 * @description Middleware para verificar si el usuario está autenticado 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Function} next - Next middleware function
 * @throws {Error} - Si no hay token o el token es inválido
 */ 
const authMiddleware = (req, res, next) => {
    // Permitir rutas públicas sin autenticación
    if (rutasPublicas.includes(req.path)) {
        return next();
    }

    const token = req.header("Auth");

    if (!token) {
        return res.status(401).json({ message: "No hay token, autorización denegada" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido" });
    }
};

module.exports = authMiddleware;
