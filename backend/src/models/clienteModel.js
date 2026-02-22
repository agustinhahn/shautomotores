const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true, // Allow true initially to not break existing rows during sync
    references: {
      model: 'users',
      key: 'id',
    },
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estado_interes: {
    type: DataTypes.ENUM('Interesado 0km', 'Interesado Usado', 'Entrega Vehículo', 'Entrega Dinero'),
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'clientes',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Cliente;
