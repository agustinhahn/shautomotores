const { Vehicle, User, VehicleView, sequelize } = require('../models');
const { Op } = require('sequelize');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const { role, id: userId } = req.user;
        const whereClause = role === 'super_admin' ? {} : { user_id: userId };

        const totalVehicles = await Vehicle.count({ where: whereClause });
        const activeVehicles = await Vehicle.count({ where: { ...whereClause, status: 'published' } });
        const pendingVehicles = await Vehicle.count({ where: { ...whereClause, status: 'pending_approval' } });
        const soldVehicles = await Vehicle.count({ where: { ...whereClause, status: 'sold' } });
        
        // Users count only relevant for super_admin
        const totalUsers = role === 'super_admin' ? await User.count() : 0;

        // Check if messages/leads table exists later, for now placeholder
        const newLeads = 0; 

        res.json({
            totalVehicles,
            activeVehicles,
            pendingVehicles,
            soldVehicles,
            totalUsers,
            newLeads
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

// @desc    Get chart data
// @route   GET /api/dashboard/charts
// @access  Private/Admin
const getChartsData = async (req, res) => {
    try {
        const { role, id: userId } = req.user;
        const whereClause = role === 'super_admin' ? {} : { user_id: userId };

        // Vehicles by Seller - Only for Super Admin usually, or show own stats
        let sellerData = [];
        if (role === 'super_admin') {
            const vehiclesBySeller = await Vehicle.findAll({
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('Vehicle.id')), 'count']
                ],
                include: [{
                    model: User,
                    as: 'seller',
                    attributes: ['full_name']
                }],
                group: ['seller.id', 'seller.full_name']
            });

            sellerData = vehiclesBySeller.map(v => ({
                name: v.seller ? v.seller.full_name : 'Unknown',
                vehicles: parseInt(v.getDataValue('count'))
            }));
        } else {
             // For seller, maybe show breakdown by status instead? Or just their own "performance"
             // For now, let's just show their own count as a single bar effectively
             const myCount = await Vehicle.count({ where: whereClause });
             const user = await User.findByPk(userId);
             sellerData = [{ name: user.full_name, vehicles: myCount }];
        }

        // Vehicles created over time (last 6 months)
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
            order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']]
        });

        const activityData = vehiclesByDate.map(v => {
            const date = new Date(v.getDataValue('month'));
            return {
                name: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                vehicles: parseInt(v.getDataValue('count'))
            };
        });

        // Daily Views (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const viewsByDate = await VehicleView.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('viewed_at')), 'day'],
                [sequelize.fn('COUNT', 'id'), 'count']
            ],
            include: [{
                model: Vehicle,
                attributes: [],
                where: whereClause // Filter by user_id if needed
            }],
            where: {
                viewed_at: {
                    [Op.gte]: thirtyDaysAgo
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('viewed_at'))],
            order: [[sequelize.fn('DATE', sequelize.col('viewed_at')), 'ASC']]
        });

        const dailyViewsData = viewsByDate.map(v => {
            const date = new Date(v.getDataValue('day'));
            return {
                name: date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
                views: parseInt(v.getDataValue('count'))
            };
        });

        res.json({
            sellerData,
            activityData,
            dailyViewsData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching chart data' });
    }
};

module.exports = {
    getStats,
    getChartsData
};
