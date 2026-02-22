const { Vehicle, VehicleImage, User, VehicleView } = require('../models');
const { Op } = require('sequelize');
const createVehicle = async (req, res) => {
    try {
        console.log("Creating vehicle with body:", req.body); // Log request body for debugging
        const { brand, model, year, price, currency, mileage, condition, description, sale_type, promotional_text, pricing_details } = req.body;
        const user_id = req.user.id;

        // Validation for required fields to provide clear error
        if (!brand || !model || !year || !price || !mileage) {
            return res.status(400).json({ message: 'Missing required fields: brand, model, year, price, or mileage.' });
        }

        let parsedPricingDetails = pricing_details;
        if (typeof pricing_details === 'string') {
            try {
                parsedPricingDetails = JSON.parse(pricing_details);
            } catch (e) {
                console.error('Error parsing pricing_details:', e);
                parsedPricingDetails = {}; 
            }
        }

        const newVehicle = await Vehicle.create({
            user_id,
            brand,
            model,
            year,
            price,
            currency,
            mileage,
            condition,
            description,
            sale_type,
            promotional_text,
            pricing_details: parsedPricingDetails,
            status: 'pending_approval' // Default status
        });

        if (req.files && req.files.length > 0) {
            const imagePromises = req.files.map((file, index) => {
                return VehicleImage.create({
                    vehicle_id: newVehicle.id,
                    url: `/uploads/vehicles/${file.filename}`,
                    is_main: index === 0 // First image is main
                });
            });
            await Promise.all(imagePromises);
        }

        const vehicleWithImages = await Vehicle.findByPk(newVehicle.id, {
            include: [{ model: VehicleImage, as: 'images' }]
        });

        res.status(201).json(vehicleWithImages);
    } catch (error) {
        console.error("Error in createVehicle:", error);
        res.status(500).json({ message: 'Error creating vehicle', error: error.message });
    }
};

const getVehicles = async (req, res) => {
    try {
        const { status, sale_type, sort, brand, model, yearFrom, yearTo, minPrice, maxPrice } = req.query;
        const whereClause = {};

        // Status Filter
        if (status) whereClause.status = status;
        
        // Sale Type Filter
        if (sale_type) whereClause.sale_type = sale_type;

        // Brand Filter (Case Insensitive)
        if (brand) whereClause.brand = { [Op.iLike]: `%${brand}%` };

        // Model Filter (Case Insensitive)
        if (model) whereClause.model = { [Op.iLike]: `%${model}%` };

        // Year Range Filter
        if (yearFrom || yearTo) {
            whereClause.year = {};
            if (yearFrom) whereClause.year[Op.gte] = yearFrom;
            if (yearTo) whereClause.year[Op.lte] = yearTo;
        }

        // Price Range Filter
        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) whereClause.price[Op.gte] = minPrice;
            if (maxPrice) whereClause.price[Op.lte] = maxPrice;
        }

        let order = [['createdAt', 'DESC']];
        if (sort === 'views_desc') {
            order = [['views', 'DESC']];
        } else if (sort === 'views_asc') {
            order = [['views', 'ASC']];
        }

        const vehicles = await Vehicle.findAll({
            where: whereClause,
            include: [
                { model: VehicleImage, as: 'images' },
                { model: User, as: 'seller', attributes: ['full_name', 'email'] }
            ],
            order: order
        });
        res.json(vehicles);
    } catch (error) {
        console.error("Error in getVehicles:", error);
        res.status(500).json({ message: 'Error fetching vehicles' });
    }
};

const getMyVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll({
            where: { user_id: req.user.id },
            include: [
                { model: VehicleImage, as: 'images' },
                { model: User, as: 'seller', attributes: ['full_name', 'email'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(vehicles);
    } catch (error) {
        console.error("Error in getMyVehicles:", error);
        res.status(500).json({ message: 'Error fetching my vehicles' });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByPk(id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Check ownership or admin role
        if (vehicle.user_id !== req.user.id && req.user.role !== 'super_admin') {
            return res.status(403).json({ message: 'Not authorized to delete this vehicle' });
        }

        await vehicle.destroy(); // Soft delete if paranoid is true in model, or hard delete
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vehicle' });
    }
};

const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByPk(id, {
            include: [
                { model: VehicleImage, as: 'images' },
                { model: User, as: 'seller', attributes: ['full_name', 'email', 'phone'] } // Added phone if available
            ]
        });

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Increment views
        vehicle.views = (vehicle.views || 0) + 1;
        await vehicle.save({ fields: ['views'] }); // Only update views to avoid side effects

        // Log view in VehicleView table for daily analytics
        try {
            await VehicleView.create({ vehicle_id: id });
        } catch (viewError) {
            console.error('Error logging view:', viewError);
            // Non-blocking error
        }

        res.json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching vehicle details' });
    }
};

const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { brand, model, year, price, currency, mileage, condition, description, status, sale_type, promotional_text, pricing_details } = req.body;
        
        const vehicle = await Vehicle.findByPk(id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Check ownership or admin role
        if (vehicle.user_id !== req.user.id && req.user.role !== 'super_admin') {
            return res.status(403).json({ message: 'Not authorized to update this vehicle' });
        }

        let parsedPricingDetails = pricing_details;
        if (typeof pricing_details === 'string') {
            try {
                parsedPricingDetails = JSON.parse(pricing_details);
            } catch (e) {
                console.error('Error parsing pricing_details:', e);
            }
        }

        // Construct update object
        const updateData = {};
        if (brand) updateData.brand = brand;
        if (model) updateData.model = model;
        if (year) updateData.year = year;
        if (price) updateData.price = price;
        if (currency) updateData.currency = currency;
        if (mileage) updateData.mileage = mileage;
        if (condition) updateData.condition = condition;
        if (description) updateData.description = description;
        if (sale_type) updateData.sale_type = sale_type;
        if (promotional_text !== undefined) updateData.promotional_text = promotional_text;
        if (pricing_details !== undefined) updateData.pricing_details = parsedPricingDetails;

        if (status) {
             if (req.user.role === 'super_admin') {
                 updateData.status = status;
             } else if (['sold', 'paused', 'hidden'].includes(status) && vehicle.user_id === req.user.id) {
                 // Allow seller to mark as sold, paused, or hidden (oculto)
                 updateData.status = status; 
             }
        }

        await vehicle.update(updateData);
        
        const updatedVehicle = await Vehicle.findByPk(id, {
             include: [{ model: VehicleImage, as: 'images' }]
        });

        res.json(updatedVehicle);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating vehicle' });
    }
};

module.exports = {
    createVehicle,
    getVehicles,
    getMyVehicles,
    deleteVehicle,
    getVehicleById,
    updateVehicle
};
