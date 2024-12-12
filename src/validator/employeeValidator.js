const { body, param } = require('express-validator')

const idParamValidation = () => param('id').isUUID()


const createEmployeeValidator = () => {

    const nameValidation = body('name')
        .isString().trim()
        .isLength({ min: 1 }).withMessage('Name is required.')

    const salaryValidation = body('salary')
        .isNumeric().withMessage('Salary must be a number.')

    const cpfValidation = body('cpf')
        .isString().trim()
        .isLength({ min: 14, max: 14 }).withMessage('CPF must be 14 characters long (including dots and hyphen).')
        .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).withMessage('CPF must be in the format xxx.xxx.xxx-xx.')

    const passValidation = body('password')
        .isString().trim()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')

    const isEqualPass = (value, { req }) => value === req.body.password

    const confirmPassValidation = body('confirmPassword')
        .isString().trim()
        .custom(isEqualPass)
        .withMessage("Passwords must match.")

    return [
        nameValidation,
        salaryValidation,
        cpfValidation,
        passValidation,
        confirmPassValidation
    ]
}


const editEmployeeValidator = () => {
    const nameValidation = body('name')
        .isString().trim()
        .isLength({ min: 1 }).withMessage('Name is required.')

    const salaryValidation = body('salary')
        .isNumeric().withMessage('Salary must be a number.')

    const cpfValidation = body('cpf')
        .isString().trim()
        .isLength({ min: 14, max: 14 }).withMessage('CPF must be 14 characters long (including dots and hyphen).')
        .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).withMessage('CPF must be in the format xxx.xxx.xxx-xx.')

    const passValidation = body('password')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long.')
        
    const isEqualPass = (value, { req }) => value === req.body.password

    const confirmPassValidation = body('confirmPassword')
        .if(body('password').exists())
        .notEmpty()
        .withMessage('Confirm password is required when password is provided.')
        .isString()
        .trim()
        .custom(isEqualPass)
        .withMessage('Passwords must match.');


    return [
        idParamValidation(),
        nameValidation,
        salaryValidation,
        cpfValidation,
        passValidation,
        confirmPassValidation
    ]
}

module.exports = {
    createEmployeeValidator,
    idParamValidation,
    editEmployeeValidator
}