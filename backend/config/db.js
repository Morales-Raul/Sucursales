const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('master', 'sa', 'Admin123!', {
  host: 'localhost',
  port: 1433,
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true
    }
  },
  logging: false
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexion exitosa a SQL Server');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();

module.exports = sequelize;