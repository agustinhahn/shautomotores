const { Vehicle, VehicleView, sequelize } = require('./src/models');

const seedViews = async () => {
    try {
        const vehicles = await Vehicle.findAll();
        
        for (const vehicle of vehicles) {
            const viewsCount = vehicle.views || 0;
            if (viewsCount > 0) {
                console.log(`Seeding ${viewsCount} views for vehicle ${vehicle.id}...`);
                
                const viewsToCreate = [];
                for (let i = 0; i < viewsCount; i++) {
                    // Random date within last 30 days
                    const daysAgo = Math.floor(Math.random() * 30);
                    const date = new Date();
                    date.setDate(date.getDate() - daysAgo);
                    
                    viewsToCreate.push({
                        vehicle_id: vehicle.id,
                        viewed_at: date
                    });
                }
                
                await VehicleView.bulkCreate(viewsToCreate);
            }
        }
        
        console.log('Seeding complete!');
    } catch (error) {
        console.error('Error seeding views:', error);
    } finally {
        await sequelize.close();
    }
};

seedViews();
