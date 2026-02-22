const { Registro, User, Vehicle } = require('../models');

// @desc    Get all registros
// @route   GET /api/registros
// @access  Private/Admin
const getRegistros = async (req, res, next) => {
  try {
    const registros = await Registro.findAll({
      include: [
        { model: User, as: 'vendedor', attributes: ['id', 'full_name', 'email'] },
        { model: Vehicle, as: 'vehiculo', attributes: ['id', 'brand', 'model', 'year', 'price', 'currency'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(registros);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new registro
// @route   POST /api/registros
// @access  Private/Admin
const createRegistro = async (req, res, next) => {
  try {
    const { vendedor_id, vehiculo_id, titulo, descripcion, estado } = req.body;
    
    // Validate required fields
    if (!vendedor_id || !vehiculo_id || !titulo) {
      return res.status(400).json({ message: 'Vendedor, vehiculo y titulo son requeridos' });
    }

    const registro = await Registro.create({
      vendedor_id,
      vehiculo_id,
      titulo,
      descripcion,
      estado: estado || 'Abierto'
    });

    res.status(201).json(registro);
  } catch (error) {
    next(error);
  }
};

// @desc    Update registro
// @route   PUT /api/registros/:id
// @access  Private/Admin
const updateRegistro = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado, descripcion } = req.body;

    const registro = await Registro.findByPk(id);
    
    if (!registro) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    if (estado) registro.estado = estado;
    if (descripcion !== undefined) registro.descripcion = descripcion;

    await registro.save();

    res.json(registro);
  } catch (error) {
    next(error);
  }
};

// @desc    Get options for selectors (vendors and vehicles)
// @route   GET /api/registros/options
// @access  Private/Admin
const getOptions = async (req, res, next) => {
  try {
    const vendors = await User.findAll({
      attributes: ['id', 'full_name', 'email'],
      where: { role: 'seller', status: 'active' }
    });

    const vehicles = await Vehicle.findAll({
      attributes: ['id', 'brand', 'model', 'year', 'user_id'],
      where: { status: 'published' }
    });

    res.json({ vendors, vehicles });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRegistros,
  createRegistro,
  updateRegistro,
  getOptions
};
