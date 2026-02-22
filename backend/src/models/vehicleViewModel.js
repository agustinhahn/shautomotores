const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const VehicleView = sequelize.define('VehicleView', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  vehicle_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  viewed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false, // We only care about the viewed_at time
});

module.exports = VehicleView;
