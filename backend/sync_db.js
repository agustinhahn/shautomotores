const { sequelize } = require('./src/models');
require('dotenv').config();

const syncDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    
    // Sync all models (force: true drops tables if they exist - use with caution, good for dev init)
    // For this step, I'll use force: true as requested to create tables from scratch
    await sequelize.sync({ force: true }); 
    
    console.log('Database synced successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
};

syncDB();
