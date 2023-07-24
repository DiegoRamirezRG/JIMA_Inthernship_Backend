const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./config/databaseConfig');


const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.disable('x-powered-by');

module.exports = {
    app: app
}