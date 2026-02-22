const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Registro = sequelize.define('Registro', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  vendedor_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  vehiculo_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'vehicles',
      key: 'id',
    },
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('Abierto', 'Pendiente', 'Cerrado'),
    defaultValue: 'Abierto',
  },
}, {
  timestamps: true,
  tableName: 'registros',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Registro;
