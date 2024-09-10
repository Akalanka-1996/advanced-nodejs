import cluster from "cluster";
import os from "os";
import { dirname } from "path";
import { fileURLToPath } from "url";

const _dirname = dirname(fileURLToPath(import.meta.url));

const cpuCount = os.cpus().length;

console.log(`The total number of CPU is ${cpuCount}`);
console.log(`Primary pid=${process.pid}`);

cluster.setupPrimary({
    exec: _dirname + "/index.js",
});

for (let i=0; i< cpuCount; i++) {
    cluster.fork();
}

// whenever instance is down, start another one
// This is not load balancing. We always have 8 instances
cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} has been killed`);
    console.log("Starting another worker");
    cluster.fork();
});