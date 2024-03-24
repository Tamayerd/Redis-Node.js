import { createClient } from "redis";
import RedisStore from "connect-redis";
import session from "express-session";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Repository } from "redis-om";
import { deviceSchema } from "./data-access-object/redis-modxel.js";

dotenv.config();
const app = express();

app.use(express.json({ limit: "25mb" }));
app.use(cors());
const PORT = process.env.REDIS_PORT;

const redisClient = createClient({
  password: "124",
  socket: {
    host: "redis-1-1.ec2.cloud.redislabs.com",
    port: 11,
  },
});
//New method
let redisStore = new RedisStore({
  client: redisClient,
});
await redisClient.connect().catch(console.error);

// Returns PONG
console.log(`Response from PING command: ${await redisClient.ping()}`);

app.use(
  session({
    store: redisStore,
    secret: process.env.MY_SECRET,
    saveUninitialized: false, // recommended: only save session when data exists
    resave: false, // required: force lightweight session keep alive (touch)
    cookie: {
      secure: "production", //if ture only transmit cookie over https
      httpOnly: true, //if true: prevents client side JS from reading the cookie
      maxAge: 1000 * 60 * 30,
    },
  })
);



var RestInitialization = app.listen(16186, function () {
  console.log("Https Server listening at http://localhost:%s", 16186);
});

export default { RestInitialization };
