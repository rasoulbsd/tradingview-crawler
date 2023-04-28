const winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;

var myFormat;


module.exports = {
    initialize_logger(label_name){
        // Define log format
        myFormat = printf(({ level, message, label, timestamp }) => {
            switch (level) {
                case 'error':
                  return `${timestamp}, [${label}] \x1b[31m${level.toUpperCase()}:\x1b[0m ${message}`;
                case 'warn':
                  return `${timestamp}, [${label}] \x1b[33m${level.toUpperCase()}:\x1b[0m ${message}`;
                default:
                  return `${timestamp} [${label}] \x1b[32m${level.toUpperCase()}:\x1b[0m ${message}`;
              }
        });

        // Create logger instance
        const logger = winston.createLogger({
        format: combine(
            label({ label: "TradingView Crawler" }),
            timestamp(),
            myFormat
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'logs/app.log' })
        ]
        });

        // // // Log messages with different levels
        // logger.error('This is an error message');
        // logger.warn('This is a warning message');
        // logger.info('This is an info message');
        // logger.verbose('This is a verbose message');
        // logger.debug('This is a debug message');
        // logger.silly('This is a silly message');

        return logger;
    },
    change_logger_label(logger, label){
        logger.format = combine(
            winston.format.label({ label: label }),
            timestamp(),
            myFormat
        )
        return logger;
    }
}
