const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Intentando conectar a MongoDB...');
    console.log('URI:', process.env.MONGODB_URI ? 'Configurada' : 'NO CONFIGURADA');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
