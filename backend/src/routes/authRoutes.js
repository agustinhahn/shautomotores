const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Define rate limiter for login route to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Limit each IP to 5 login requests per `window` (here, per 15 minutes)
  message: { message: 'Demasiados intentos de inicio de sesión desde esta IP, por favor inténtalo de nuevo después de 15 minutos' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);
router.get('/me', protect, getMe);

module.exports = router;
