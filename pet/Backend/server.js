const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const fs = require('fs'); 
require('dotenv').config();

const app = express();

// Verifica si la carpeta 'uploads' existe, si no, la crea
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middlewares
app.use(cors({
  origin: 'http://localhost:3001', // Reemplaza con el origen de tu frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Permitir credenciales como cookies y cabeceras de autenticación
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configuración de la sesión
app.use(session({
  secret: 'tu_secreto_aqui', 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } 
}));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch((err) => console.error('Error al conectar a MongoDB:', err));

// Rutas
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);


app.get('/', (req, res) => {
  res.send('API para el marketplace de mascotas');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
