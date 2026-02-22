const { User } = require('./src/models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const API_URL = 'http://localhost:5001/api';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const testEndpoints = async () => {
    try {
        console.log('Fetching users to find an admin and a seller...');
        
        let admin = await User.findOne({ where: { role: 'super_admin' } });
        if (!admin) {
            console.log('No admin found, creating a dummy one for test');
            admin = await User.create({
                full_name: 'Test Admin',
                email: 'admin_test@sh.com',
                password_hash: 'ignored',
                role: 'super_admin'
            });
        }

        let seller = await User.findOne({ where: { role: 'seller' } });
        if (!seller) {
            console.log('No seller found, creating a dummy one for test');
            seller = await User.create({
                full_name: 'Test Seller',
                email: 'seller_test@sh.com',
                password_hash: 'ignored',
                role: 'seller'
            });
        }

        const adminToken = generateToken(admin.id);
        const sellerToken = generateToken(seller.id);

        console.log('\n--- Testing Admin Access ---');
        
        const adminRes1 = await fetch(`${API_URL}/registros`, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log(`Admin can access /registros: ${adminRes1.status} (Expected 200)`);
        
        const adminRes2 = await fetch(`${API_URL}/clientes`, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log(`Admin can access /clientes: ${adminRes2.status} (Expected 200)`);
        
        console.log('\n--- Testing Seller Access ---');
        
        const sellerRes1 = await fetch(`${API_URL}/registros`, { headers: { Authorization: `Bearer ${sellerToken}` } });
        console.log(`Seller can access /registros: ${sellerRes1.status} (Expected 401/403)`);
        
        const sellerRes2 = await fetch(`${API_URL}/clientes`, { headers: { Authorization: `Bearer ${sellerToken}` } });
        console.log(`Seller can access /clientes: ${sellerRes2.status} (Expected 200)`);

        process.exit(0);

    } catch (err) {
        console.error('Fatal error in testing:', err);
        process.exit(1);
    }
}

testEndpoints();
