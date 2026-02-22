const { User, Vehicle, VehicleView, sequelize } = require('./src/models');

const inspectDB = async () => {
    try {
        const users = await User.findAll({ attributes: ['id', 'email', 'role', 'full_name'] });
        console.log('--- USERS ---');
        users.forEach(u => console.log(`${u.id} | ${u.email} | ${u.role} | ${u.full_name}`));

        const vehicles = await Vehicle.findAll({ attributes: ['id', 'brand', 'model', 'user_id', 'status', 'views'] });
        console.log('\n--- VEHICLES ---');
        vehicles.forEach(v => console.log(`${v.id} | ${v.brand} ${v.model} | Owner: ${v.user_id} | Status: ${v.status} | Views: ${v.views}`));

        const views = await VehicleView.findAll();
        console.log('\n--- VEHICLE VIEWS ---');
        console.log(`Total view records: ${views.length}`);

    } catch (error) {
        console.error('Error inspecting DB:', error);
    } finally {
        await sequelize.close();
    }
};

inspectDB();
