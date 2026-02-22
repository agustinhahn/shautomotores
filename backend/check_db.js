const { sequelize } = require('./src/models');
const fs = require('fs');

const runMigration = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection OK.');

        const sql = fs.readFileSync('./migrations/registros_clientes.sql', 'utf8');
        await sequelize.query(sql);
        console.log('Migration executed successfully.');
        
        const [results] = await sequelize.query('SELECT table_name FROM information_schema.tables WHERE table_schema=\'public\' AND table_name IN (\'registros\', \'clientes\')');
        console.log('Found tables:', results.map(r => r.table_name));

        process.exit(0);
    } catch (error) {
        console.error('Error executing migration:', error);
        process.exit(1);
    }
};

runMigration();
