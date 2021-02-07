const winston = require("winston");
const { File } = require("winston/lib/winston/transports");

const today = new Date();
const filename = `./log_${today.getFullYear()}${today.getMonth()}${today.getDate()}.txt`;

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] - ${message}`;
});

module.exports = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), customFormat),
  transports: [
    new winston.transports.File({ filename }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        customFormat
      ),
    }),
  ],
});
