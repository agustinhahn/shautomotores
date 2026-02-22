const express = require('express');
const router = express.Router();
const { 
  getClientes, 
  createCliente, 
  updateCliente 
} = require('../controllers/clientes.controller');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getClientes)
  .post(protect, createCliente);

router.route('/:id')
  .put(protect, updateCliente);

module.exports = router;
