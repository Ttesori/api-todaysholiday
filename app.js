const cors = require('cors');
const express = require('express');
const app = express();
const connectDB = require('./config/database');

connectDB();

const homeRoutes = require('./routes/home');
const holidaysRoutes = require('./routes/holidays');
const adminRoutes = require('./routes/admin');

// Settings and Middleware
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', homeRoutes);
app.use('/holidays', holidaysRoutes);
app.use('/admin', adminRoutes);

// Start Server
app.listen(process.env.PORT, () => {
  console.log('Server started...');
});