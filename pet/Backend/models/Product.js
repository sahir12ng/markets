const mongoose = require('mongoose');

// Definición del esquema de producto
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // Almacena la ruta de la imagen subida
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Perros', 'Gatos', 'Pájaros', 'Peces'], // Enumera las categorías permitidas
    required: true,
  },
});

// Creación del modelo de producto
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
