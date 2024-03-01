const expressWinston = require('express-winston')
const winston = require('winston')
const redisClient = require('../config/redisClient')

const logger = () => {
    return expressWinston.logger({
        transports: [
            new winston.transports.Console(),
        ],
        format: winston.format.combine(
            winston.format.printf((info) => {
                const level = info.level.toUpperCase()
                const method = info.meta.req.method
                const url = info.meta.req.url
                const ip = info.meta.ip.startsWith('::ffff:') ? info.meta.ip.substring(7) : info.meta.ip
                const logMessage = `${level}\t ${method} || URL: ${url}, IP: ${ip}`

                // Log to Redis
                redisClient.rPush('logs', logMessage.trim())

                return logMessage
            })
        ),
        statusLevels: true,
        expressFormat: false,
        colorize: true,
        dynamicMeta: (req, res) => {
            return {
                ip: req.ip,
                req: {
                    method: req.method,
                    url: req.originalUrl,
                },
            }
        },
    })
}

module.exports = logger