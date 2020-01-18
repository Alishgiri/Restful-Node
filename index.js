const Joi = require("joi");
require("express-async-errors");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const winston = require("winston");
const express = require("express");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);
const dbDebugger = require("debug")("app:db");
const startupDebugger = require("debug")("app:startup");

const auth = require("./routes/auth");
const home = require("./routes/home");
const users = require("./routes/users");
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const error = require("./middleware/error");
const customers = require("./routes/customers");

// winston.add(new winston.transports.File({ filename: "error.log" }));

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR:: JWT private key is not defined.");
  // process.exit(0) means success other value is error
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/vidly", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to MongoDB…"))
  .catch(err => console.log("Could ot connect to MongoDB.", err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan Enabled…");
}

app.use("/", home);
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/customers", customers);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}…`);
});
