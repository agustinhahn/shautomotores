const { sequelize } = require('../config/db');
const User = require('./userModel');
const Vehicle = require('./vehicleModel');
const VehicleImage = require('./vehicleImageModel');
const Lead = require('./leadModel');
const ActivityLog = require('./activityLogModel');
const VehicleView = require('./vehicleViewModel');
const Registro = require('./registroModel');
const Cliente = require('./clienteModel');

// Associations

// User has many Vehicles
User.hasMany(Vehicle, { foreignKey: 'user_id' });
Vehicle.belongsTo(User, { foreignKey: 'user_id', as: 'seller' });

// User has many Registros
User.hasMany(Registro, { foreignKey: 'vendedor_id', as: 'registros' });
Registro.belongsTo(User, { foreignKey: 'vendedor_id', as: 'vendedor' });

// Vehicle has many Registros
Vehicle.hasMany(Registro, { foreignKey: 'vehiculo_id', as: 'registros' });
Registro.belongsTo(Vehicle, { foreignKey: 'vehiculo_id', as: 'vehiculo' });

// User has many Clientes
User.hasMany(Cliente, { foreignKey: 'user_id', as: 'clientes' });
Cliente.belongsTo(User, { foreignKey: 'user_id', as: 'vendedor' });

// Vehicle has many Images
Vehicle.hasMany(VehicleImage, { foreignKey: 'vehicle_id', as: 'images', onDelete: 'CASCADE' });
VehicleImage.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

// Vehicle has many Leads
Vehicle.hasMany(Lead, { foreignKey: 'vehicle_id' });
Lead.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

// User has many Logs
User.hasMany(ActivityLog, { foreignKey: 'user_id' });
ActivityLog.belongsTo(User, { foreignKey: 'user_id' });

// Vehicle has many Views
Vehicle.hasMany(VehicleView, { foreignKey: 'vehicle_id', as: 'viewLogs' });
VehicleView.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });


module.exports = {
  sequelize,
  User,
  Vehicle,
  VehicleImage,
  Lead,
  ActivityLog,
  VehicleView,
  Registro,
  Cliente,
};
