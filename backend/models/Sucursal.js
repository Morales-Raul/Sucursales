const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sucursal = sequelize.define('Sucursal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  activa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'sucursales',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

// Sincronizar modelo con la base de datos
(async () => {
  try {
    await Sucursal.sync({ alter: true });  // alter: true actualiza la tabla si existe
    console.log('✅ Modelo Sucursal sincronizado');
  } catch (error) {
    console.error('❌ Error al sincronizar:', error.message);
  }
})();

module.exports = Sucursal;