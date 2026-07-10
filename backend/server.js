const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const sucursalRoutes = require('./routes/sucursalRoutes');

const app = express();


app.use(cors());
app.use(express.json());


app.use('/api/sucursales', sucursalRoutes);


app.get('/', (req, res) => {
  res.json({ mensaje: '🚀 API de Sucursales funcionando' });
});


app.use((err, req, res, next) => {
  console.error('❌ Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});


const startServer = async () => {
  try {
  
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL');
    
    // Sincronizar modelos
    await sequelize.sync({ force: false }); 
    console.log('🗄️ Base de datos sincronizada');
    
    // Arrancar servidor
    app.listen(3001, () => {
      console.log('🚀 Servidor backend corriendo en puerto 3001');
      console.log('📝 Endpoints disponibles:');
      console.log('   GET    /api/sucursales');
      console.log('   GET    /api/sucursales/todas');
      console.log('   POST   /api/sucursales');
      console.log('   PUT    /api/sucursales/:id');
      console.log('   PUT    /api/sucursales/baja/:id');
      console.log('   PUT    /api/sucursales/alta/:id');
      console.log('   DELETE /api/sucursales/:id');
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();