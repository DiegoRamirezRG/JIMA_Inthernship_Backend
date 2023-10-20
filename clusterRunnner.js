const cluster = require('cluster');
const os = require('os');
const { dirname } = require('path');
const { fileURLToPath } = require('url');

const __directory = dirname(__filename);

const cpuCount = os.cpus().length;

console.log(`The total number os CPUs is ${cpuCount}`);
console.log(`Primary pid = ${process.pid}`);;

cluster.setupPrimary({
    exec: __directory + "/index.js",
})

for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
}

cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} has been killed`);
    console.log('Starting another worker');
    cluster.fork();
})