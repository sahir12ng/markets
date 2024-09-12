const express = require('express');
const multer = require('multer');
const router = express.Router();
const Product = require('../models/Product');

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Ruta para agregar un nuevo producto con imagen
router.post('/', upload.single('image'), async (req, res) => {
  const { name, description, price, category } = req.body;
  const image = req.file ? req.file.path : '';

  try {
    const newProduct = new Product({ name, description, price, category, image });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ message: 'Error al agregar producto' });
  }
});

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});

// Ruta para obtener un producto por ID
router.get('/:id', async (req, res) => {
  console.log(`Solicitud para obtener el producto con ID: ${req.params.id}`);
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
});

// Ruta para actualizar un producto por ID
router.put('/:id', upload.single('image'), async (req, res) => {
  const { name, description, price, category } = req.body;
  const updateData = { name, description, price, category };

  // Si hay una nueva imagen, agregarla al objeto de actualización
  if (req.file) {
    updateData.image = req.file.path;
  }

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
});

// Ruta para eliminar un producto por ID
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
});

module.exports = router;
