const winston = require("winston");

const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" })
  ]
});

module.exports = function(err, req, res, next) {
  logger.error(err.message, err);
  //   winston.log(err);
  res.status(500).send("Something failed.");
};
