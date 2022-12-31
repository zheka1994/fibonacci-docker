const keys = require("./keys");
const redis = require("redis");


let redisClient;
let sub;
(async () => {
    redisClient = redis.createClient({
        url: `redis://${keys.redisHost}:${keys.redisPort}`
    });
    redisClient.on("error", (err) => console.log("Redis Client Error", err));
    await redisClient.connect();
    sub = redisClient.duplicate();
    sub.connect();
    sub.subscribe("insert", (message, channel) => {
        console.log("I HAVE MESSAGE!");
        redisClient.hSet("values", message, fib(parseInt(message)));
    });
})();

function fib(index) {
    if (index < 2)
        return 1;
    return fib(index - 1) + fib(index - 2);
}