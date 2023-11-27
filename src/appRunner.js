const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

//Routes Provider
const RoutesProv = require('./routes/routesProvider');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.disable('x-powered-by');

app.use('/images/user_profiles', express.static(path.join(__dirname, 'global/storage/user_profiles')));

RoutesProv(app);

module.exports = {
    app: app
}