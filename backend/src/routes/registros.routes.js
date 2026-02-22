const express = require('express');
const router = express.Router();
const { 
  getRegistros, 
  createRegistro, 
  updateRegistro, 
  getOptions 
} = require('../controllers/registros.controller');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, admin, getRegistros)
  .post(protect, admin, createRegistro);

router.route('/options')
  .get(protect, admin, getOptions);

router.route('/:id')
  .put(protect, admin, updateRegistro);

module.exports = router;
