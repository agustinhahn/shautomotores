const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  vehicle_id: {
    type: DataTypes.UUID,
    allowNull: true, // Can be a general inquiry
    references: {
      model: 'vehicles',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  source: {
    type: DataTypes.STRING,
    defaultValue: 'whatsapp_click',
  },
  status: {
    type: DataTypes.ENUM('new', 'contacted', 'closed', 'lost'),
    defaultValue: 'new',
  },
}, {
  timestamps: true,
  tableName: 'leads',
});

module.exports = Lead;
