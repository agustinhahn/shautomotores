const express = require('express');
const router = express.Router();
const { createVehicle, getVehicles, getMyVehicles, deleteVehicle, getVehicleById, updateVehicle } = require('../controllers/vehicleController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Public routes (if any, e.g. listing approved vehicles)
// router.get('/public', getPublicVehicles); 

// Public routes
router.get('/', getVehicles); // Publicly accessible, filter by status=published in frontend for public view

// Protected routes (Specific routes first!)
router.get('/my-vehicles', protect, getMyVehicles);
router.post('/', protect, upload.array('images', 10), createVehicle);
router.delete('/:id', protect, deleteVehicle);
router.put('/:id', protect, upload.array('images', 10), updateVehicle); // Update details/status

// Generic ID route last
router.get('/:id', getVehicleById); // Publicly accessible

module.exports = router;
