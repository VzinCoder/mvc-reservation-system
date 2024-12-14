const { isProd } = require('./isProd')
const winston = require('winston')


const customFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
    let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`
    if (stack) {
        logMessage += `\n--- STACK TRACE ---\n${stack}\n-------------------`
    }
    return logMessage;
})


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        customFormat
    ),
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.uncolorize(),
                customFormat
            )
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            format: winston.format.combine(
                winston.format.uncolorize(),
                customFormat
            )
        })
    ]
})


if (!isProd()) {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.errors({ stack: true }),
            winston.format.colorize({ all: true }), 
            winston.format.printf(({ level, message, timestamp, stack }) => {
                let logMessage = `${timestamp} [${level}]: ${message}`
                if (stack) {
                    logMessage += `\n--- STACK TRACE ---\n${stack}\n-------------------`;
                }
                return logMessage
            })
        )
    }))
}

module.exports = logger
