const { Vehicle, sequelize } = require('./src/models');
const { Op } = require('sequelize');

const debugQuery = async () => {
    try {
        const userId = '4ae3517a-e47c-420e-83f6-b2a09ed26437'; // User test2
        const whereClause = { user_id: userId };

        console.log('--- Testing count ---');
        const count = await Vehicle.count({ where: whereClause });
        console.log(`Active vehicles for user ${userId}: ${count}`);

        console.log('\n--- Testing activity query ---');
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const vehiclesByDate = await Vehicle.findAll({
            attributes: [
                [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
                [sequelize.fn('COUNT', 'id'), 'count']
            ],
            where: {
                ...whereClause,
                createdAt: {
                    [Op.gte]: sixMonthsAgo
                }
            },
            group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
            order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']],
            raw: true
        });

        console.log('Vehicles by Date (Raw):', vehiclesByDate);

        if (vehiclesByDate.length > 0) {
             const activityData = vehiclesByDate.map(v => {
                const date = new Date(v.month); // v.month since raw: true returns flat object usually, but with attributes alias...
                 // In Sequelize raw query, aliases are respected but sometimes case depends on DB driver.
                return {
                    name: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                    vehicles: parseInt(v.count)
                };
            });
            console.log('Activity Data Mapped:', activityData);
        } else {
            console.log('No activity data found.');
        }


    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

debugQuery();
