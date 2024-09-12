const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definición del esquema de usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['owner', 'user'], default: 'user' }
});

// Método para encriptar la contraseña antes de guardarla
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.error('Error al encriptar la contraseña:', error);
      next(error); // Pasa el error a la siguiente función middleware
    }
  }
  next();
});

// Método para comparar la contraseña ingresada con la almacenada
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Creación del modelo de usuario
const User = mongoose.model('User', userSchema);

module.exports = User;
