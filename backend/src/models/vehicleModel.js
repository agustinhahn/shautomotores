const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.ENUM('USD', 'ARS'),
    defaultValue: 'USD',
  },
  mileage: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  condition: {
    type: DataTypes.ENUM('new', 'used'),
    defaultValue: 'used',
  },
  category: {
    type: DataTypes.STRING, // SUV, Sedan, etc.
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending_approval', 'published', 'reserved', 'sold', 'hidden', 'rejected'),
    defaultValue: 'draft',
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  admin_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sale_type: {
    type: DataTypes.STRING, // direct, financed, external, savings_70_30, etc.
    allowNull: true, // Allow null for existing records
    defaultValue: 'direct',
  },
  pricing_details: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
  },
  promotional_text: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  technical_sheet_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'vehicles',
});

module.exports = Vehicle;
