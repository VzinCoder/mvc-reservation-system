const logger = require('./logger')

const validateEnvVars = () => {
    const requiredEnvVars = [
        { key: 'DATABASE_URL', validator: (val) => typeof val === 'string' && val.trim() !== '', errorMessage: 'DATABASE_URL is not defined or empty' },
        { key: 'COOKIE_KEY', validator: (val) => typeof val === 'string' && val.trim() !== '', errorMessage: 'COOKIE_KEY is not defined or empty' },
        { key: 'NODE_ENV', validator: (val) => ['development', 'production'].includes(val), errorMessage: 'NODE_ENV must be one of "development", "production", or "test"' },
        { key: 'ADMIN_NAME', validator: (val) => typeof val === 'string' && val.trim() !== '', errorMessage: 'ADMIN_NAME is not defined or empty' },
        { key: 'ADMIN_PASSWORD', validator: (val) => typeof val === 'string' && val.length >= 6, errorMessage: 'ADMIN_PASSWORD must be at least 6 characters long' },
        { key: 'ADMIN_CPF', validator: (val) => /^[\d]{3}\.[\d]{3}\.[\d]{3}-[\d]{2}$/.test(val), errorMessage: 'ADMIN_CPF must be in the format "000.000.000-00"' },
    ]

    requiredEnvVars.forEach(({ key, validator, errorMessage }) => {
        const value = process.env[key]
        if (!validator(value)) {
            logger.error(errorMessage)
            throw new Error(errorMessage)
        }
    })

    logger.info('All environment variables are valid')
}

module.exports = {validateEnvVars}