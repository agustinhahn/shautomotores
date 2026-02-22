const { User } = require('../models');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password_hash'] },
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json({ message: 'User role updated', user: { id: user.id, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user role' });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

// @desc    Update user (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, role, phone, status, password } = req.body;
        const bcrypt = require('bcryptjs');

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.full_name = full_name || user.full_name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.phone = phone || user.phone;
        user.status = status || user.status;

        if (password) {
             const salt = await bcrypt.genSalt(10);
             user.password_hash = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.json({ 
            message: 'User updated successfully', 
            user: { 
                id: user.id, 
                full_name: user.full_name, 
                email: user.email, 
                role: user.role,
                phone: user.phone,
                status: user.status
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user' });
    }
};

// @desc    Create new user (Admin)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        const { full_name, email, password, role, phone } = req.body;
        const bcrypt = require('bcryptjs');

        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            full_name,
            email,
            password_hash: hashedPassword,
            role: role || 'seller',
            phone
        });

        res.status(201).json({
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            status: user.status,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

module.exports = {
    getAllUsers,
    updateUserRole,
    deleteUser,
    createUser,
    updateUser
};
