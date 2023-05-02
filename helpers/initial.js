const puppeteer = require('puppeteer-extra');
var userAgent = require('user-agents');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;

var myFormat;


module.exports = {
    async initial_crawler_config(){
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setUserAgent(userAgent.random().toString());
        return page;
    },
    initial_logger(save_log = false){
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
        transports:  (save_log) ? [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'logs/app.log' })
        ] : [ new winston.transports.Console() ]
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
    },

    get_initial_args(){
        const VALUE_ARG = process.argv.slice(2)[0];
    
        if (VALUE_ARG == undefined) {
            console.log(
                "\x1b[31m%s\x1b[0m",
                `Please enter a value for prop as an argument\n`
            ); //red
            process.exit();
        }

        return VALUE_ARG;
    }
}
