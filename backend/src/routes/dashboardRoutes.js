const express = require('express');
const router = express.Router();
const { getStats, getChartsData } = require('../controllers/dashboardController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/stats', protect, getStats);
router.get('/charts', protect, getChartsData);

module.exports = router;
