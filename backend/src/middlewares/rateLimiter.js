const rateLimit = require('express-rate-limit');

// Definir el rate limiter para la API (por ejemplo, rutas de leads)
// Limita a 100 peticiones cada 15 minutos por IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: {
    message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true, // Devuelve info del rate limit en los headers `RateLimit-*`
  legacyHeaders: false, // Desactiva los headers antiguos `X-RateLimit-*`
});

module.exports = apiLimiter;
