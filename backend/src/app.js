const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Security Middlewares
// Disable Cross-Origin-Resource-Policy or set it to cross-origin so frontend can load images from uploads
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const userRoutes = require('./routes/userRoutes');
const leadRoutes = require('./routes/leadRoutes');
// const statsRoutes = require('./routes/statsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const registrosRoutes = require('./routes/registros.routes');
const clientesRoutes = require('./routes/clientes.routes');
const path = require('path');
const { connectDB, sequelize } = require('./config/db');

// Connect to DB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.join(__dirname, '../uploads');
console.log('Serving static files from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Sync models and create default admin (dev and initial prod setup)
sequelize.sync({ alter: true }).then(async () => {
  console.log('Database synced');
  
  // Seed default admin user
  try {
    const User = require('./models/userModel');
    const bcrypt = require('bcryptjs');
    
    // Check if any admin exists
    const adminExists = await User.findOne({ where: { role: 'super_admin' } });
    
    if (!adminExists) {
      console.log('No admin user found. Creating default admin...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('shgiovani2026', salt);
      
      await User.create({
        full_name: 'Administrador',
        email: 'admin@shautomotores.com',
        password_hash: hashedPassword,
        role: 'super_admin',
        status: 'active'
      });
      console.log('Default admin user created successfully (admin@shautomotores.com)');
    }
  } catch (error) {
    console.error('Error creating default admin user:', error);
  }
});

const { errorMiddleware } = require('./middlewares/errorMiddleware');
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);
// app.use('/api/stats', statsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/registros', registrosRoutes);
app.use('/api/clientes', clientesRoutes);

app.get('/', (req, res) => {
  res.send('SH Automotores API is running');
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with enhanced error handling`);
});
