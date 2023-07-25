const { app } = require('./src/appRunner');
const server = require('http').createServer(app);
require('dotenv').config();

server.listen(process.env.PORT, process.env.ADDR || 'localhost', () => {
    console.log(`Server is running at ${process.env.ADDR} on ${process.env.PORT}`);
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});