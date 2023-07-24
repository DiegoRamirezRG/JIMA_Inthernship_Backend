const { app } = require('./src/appRunner');
require('dotenv').config();

app.listen(process.env.PORT, process.env.ADDR || 'localhost', () => {
    console.log(`Server is running at ${process.env.ADDR} on ${process.env.PORT}`);
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});