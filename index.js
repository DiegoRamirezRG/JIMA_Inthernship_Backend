const { app } = require('./src/appRunner');

const serverOptions = {
    maxHeaderSize: 80 * 1024,
};

const server = require('http').createServer(serverOptions, app);
require('dotenv').config();

server.listen(process.env.PORT, process.env.ADDR || 'localhost', () => {
    console.log(`Server is running at ${process.env.ADDR} on ${process.env.PORT}`);
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});