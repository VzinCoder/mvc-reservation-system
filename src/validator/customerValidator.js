const { body, param } = require('express-validator')


const createCustomerValidator = () => {
    const nameValidation = body('name')
        .isString().withMessage('Name must be a string.')
        .trim()
        .isLength({ min: 1 }).withMessage('Name is required.')

    const phoneValidation = body('phone')
        .notEmpty().withMessage('Phone number is required.')
        .isNumeric().withMessage('Phone number must contain only numbers.')
        .isLength({ min: 11, max: 11 }).withMessage('Phone number must be 11 digits long.')

    const cpfValidation = body('cpf')
        .isString().withMessage('CPF must be a string.')
        .trim()
        .isLength({ min: 14, max: 14 }).withMessage('CPF must be 14 characters long (including dots and hyphen).')
        .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).withMessage('CPF must be in the format xxx.xxx.xxx-xx.')

    const emailValidation = body('email')
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Email must be a valid email address.')

    return [nameValidation, phoneValidation, cpfValidation, emailValidation]
}





module.exports = {
    createCustomerValidator
}