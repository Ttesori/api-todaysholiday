const dotenv = require('dotenv').config();
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const MongoStore = require('connect-mongo');
const app = express();
const passport = require('passport');
const passportSettings = require('./config/passport');
const homeRoutes = require('./routes/home');
const holidaysRoutes = require('./routes/holidays');
const adminRoutes = require('./routes/admin');
const tagsRoutes = require('./routes/tags');

// Connect to DB
connectDB();

// Settings and Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// THE ORDER OF THIS IS REALLY IMPORTANT -- session must come BEFORE passport setup stuff
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.DB_STRING })
}));

// Set up passport
passportSettings();
app.use(passport.initialize());
app.use(passport.session());

// V. IMPORTANT: Routes have to come after all the passport setup stuff
app.use(cors());
app.use('/', homeRoutes);
app.use('/holidays', holidaysRoutes);
app.use('/admin', adminRoutes);
app.use('/tags', tagsRoutes);

// Start Server
app.listen(process.env.PORT, () => {
  console.log('Server started...');
});