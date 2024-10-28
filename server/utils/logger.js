// server/utils/logger.js

const winston = require('winston');
require('dotenv').config();

const appLogPath = process.env.APP_LOG_PATH || './logs/app.log';
const errorLogPath = process.env.ERROR_LOG_PATH || './logs/error.log';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) =>{
        return `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
  ),
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.File({ filename: appLogPath }),
    new winston.transports.File({ filename: errorLogPath, level: 'error' })
  ],
});

module.exports = logger;

