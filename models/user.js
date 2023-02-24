const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // Validación de correo electrónico
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['vendedor', 'comprador'],
    default: 'comprador'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
