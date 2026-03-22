const express = require('express');
const router = express.Router();
const { submitLead } = require('../controllers/leadController');
const apiLimiter = require('../middlewares/rateLimiter');

// Rate limiting specifically for leads to prevent spam
router.post('/', apiLimiter, submitLead);

module.exports = router;
