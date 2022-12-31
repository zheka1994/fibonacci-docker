const bodyParser = require("body-parser");
const express = require("express");
const redis = require("redis");
const cors = require("cors");
const keys = require("./keys");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { Pool } = require("pg");
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on("connect", (client) => {
    client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch(err => console.log(err))

});

let redisClient;
let publisher;
(async () => {
    redisClient = redis.createClient({
        url: `redis://${keys.redisHost}:${keys.redisPort}`
    });
    redisClient.on("error", (err) => console.log("Redis Client Error", err));
    await redisClient.connect();
    publisher = redisClient.duplicate();
    publisher.connect();
})();

app.get('/values/all', async (request, response) => {
    // postgres get all values in database
    try {
        const values = await pgClient.query("SELECT number FROM values");
        response.send(values.rows);
    } catch (ex) {
        console.log(ex);
        response.send([]);
    }
});

app.get("/values/current", async (request, response) => {
    try {
        const value = await redisClient.hGetAll("values");
        response.send(value);
    } catch (ex) {
        console.log(ex);
        response.send("");
    }
});

app.post("/values", async (request, response) => {
    const index = `${request.body.index}`;

    if (parseInt(index) > 40) {
        return response.status(422).send("Value index too high");
    }
    redisClient.hSet("values", index, "Nothing yet!");

    publisher.publish("insert", index);

    pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

    response.send({ working: true });
});

app.listen(5000, () => {
    "Server listen port 5000";
});