const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser, createUser, updateUser } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', protect, admin, createUser);
router.get('/', protect, admin, getAllUsers);
router.put('/:id', protect, admin, updateUser);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
