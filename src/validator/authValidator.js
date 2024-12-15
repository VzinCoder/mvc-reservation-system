const { body, param } = require('express-validator')

const loginValidator = () => {
    const cpfValidation = body('cpf')
        .isString().withMessage('CPF must be a string.')
        .trim()
        .isLength({ min: 14, max: 14 }).withMessage('CPF must be 14 characters long (including dots and hyphen).')
        .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).withMessage('CPF must be in the format xxx.xxx.xxx-xx.')

    const passValidation = body('password')
        .isString().trim()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
        
    return [cpfValidation, passValidation]
}




module.exports = {
    loginValidator
}