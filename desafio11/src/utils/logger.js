import winston from "winston"
import config from "../config/config.js";

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    }
}

let logger
switch (config.envLogger) {
    case 'DEVELOPMENT':
        logger = winston.createLogger({
                levels: customLevelsOptions.levels,
                transports: [
                    new winston.transports.Console({
                        level: 'debug',
                        format: winston.format.simple()
                    }),
                    new winston.transports.File({
                        filename: './errors.log',
                        level: 'error',
                        format: winston.format.simple()
                    })
                ]
            })

        break;

    case 'PRODUCTION':
        logger = winston.createLogger({
            levels: customLevelsOptions.levels,
            transports: [
                new winston.transports.Console({
                    level: 'info',
                    format: winston.format.simple()
                }),
                new winston.transports.File({
                    filename: './errors.log',
                    level: 'error',
                    format: winston.format.simple()
                })
            ]
        })

        break;

    default:
        break;
}

export const addLogger = (req, res, next) => {
    req.logger = logger
    next()
}