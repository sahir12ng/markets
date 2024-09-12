const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart'); // Asegúrate de tener el modelo de carrito configurado

// Ruta para añadir un producto al carrito
router.post('/:userId/add', async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingProductIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (existingProductIndex >= 0) {
      // Incrementa la cantidad si el producto ya está en el carrito
      cart.items[existingProductIndex].quantity += 1;
    } else {
      // Agrega el nuevo producto al carrito
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.status(200).json({ message: 'Producto añadido al carrito con éxito' });
  } catch (error) {
    console.error('Error al añadir el producto al carrito:', error);
    res.status(500).json({ message: 'Error al añadir el producto al carrito' });
  }
});

// Ruta para obtener los productos del carrito por userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json(cart.items);
  } catch (error) {
    console.error('Error al obtener los productos del carrito:', error);
    res.status(500).json({ message: 'Error al obtener los productos del carrito' });
  }
});

module.exports = router;
