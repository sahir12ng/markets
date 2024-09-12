// userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Importa el modelo de usuario

// Ruta de registro de usuario
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario o correo electrónico ya existe' });
    }

    const newUser = new User({ username, email, password, role: role || 'user' });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Asegúrate de incluir el _id del usuario en la respuesta
    const response = {
      message: 'Inicio de sesión exitoso',
      user: {
        _id: user._id,  // Incluye el ID del usuario
        username: user.username,
        role: user.role,
      }
    };

    console.log('Respuesta de inicio de sesión:', response);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

module.exports = router;
