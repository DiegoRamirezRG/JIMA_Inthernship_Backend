const AuthHelper = require('../utils/authHelpers/authHelpers');

const jwtValidatorMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Acceso no autorizado, token no proporcionado.',
        });
    }

    try {
        const decodedToken = await AuthHelper.validate(token);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = jwtValidatorMiddleware;