const { Cliente } = require('../models');

// @desc    Get all clientes
// @route   GET /api/clientes
// @access  Private
const getClientes = async (req, res, next) => {
  try {
    const clientes = await Cliente.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new cliente
// @route   POST /api/clientes
// @access  Private
const createCliente = async (req, res, next) => {
  try {
    const { nombre, apellido, telefono, descripcion, estado_interes } = req.body;
    
    if (!nombre || !apellido || !estado_interes) {
      return res.status(400).json({ message: 'Nombre, apellido y estado_interes son requeridos' });
    }

    const cliente = await Cliente.create({
      user_id: req.user.id,
      nombre,
      apellido,
      telefono,
      descripcion,
      estado_interes
    });

    res.status(201).json(cliente);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cliente
// @route   PUT /api/clientes/:id
// @access  Private
const updateCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono, descripcion, estado_interes } = req.body;

    const cliente = await Cliente.findByPk(id);
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    if (cliente.user_id && cliente.user_id !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para editar este cliente' });
    }

    if (nombre) cliente.nombre = nombre;
    if (apellido) cliente.apellido = apellido;
    if (telefono !== undefined) cliente.telefono = telefono;
    if (descripcion !== undefined) cliente.descripcion = descripcion;
    if (estado_interes) cliente.estado_interes = estado_interes;

    await cliente.save();

    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClientes,
  createCliente,
  updateCliente
};
