const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//Routes Provider
const RoutesProv = require('./routes/routesProvider');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.disable('x-powered-by');

RoutesProv(app);

module.exports = {
    app: app
}