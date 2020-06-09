const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Define Routes
app.use('/api/user', require('./routes/api/users'));
app.use('/api/product', require('./routes/api/product'));
app.use('/api/get', require('./routes/api/get'));

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 8010;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));