const { validationResult } = require("express-validator")
const logger = require("../util/logger")
const EmployeeModel = require("../model/EmployeeModel")
const bcrypt = require('bcrypt')


class AuthController {


    static async getPageLogin(req, res, next) {
        try {
            logger.info('Rendering login page')
            res.render('auth/login')
        } catch (error) {
            logger.error('Error rendering login page', error)
            next(error)
        }
    }

    static async postLogin(req, res, next) {
        try {
            logger.info('Login')
            const { cpf, password } = req.body
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                const errorsArr = errors.array()
                const error = errorsArr[0]
                logger.warn('Error validation login')
                req.flash('error', error.msg)
                return res.redirect('/auth/login')
            }

            const employee = await EmployeeModel.findByCpf(cpf)
            if (!employee) {
                logger.warn(`User with ${cpf} not exists`)
                req.flash('error', `User with ${cpf} not exists`)
                return res.redirect('/auth/login')
            }

            const isEqualPass = await bcrypt.compare(password, employee.password)
            if(!isEqualPass){
                logger.warn(`Invalid credentials`)
                req.flash('error', `Invalid credentials`)
                return res.redirect('/auth/login')
            }

            // set user in session
            req.session.user = employee
            logger.info(`Login employee with cpf ${cpf} sucess`)
            res.redirect('/')
        } catch (error) {
            logger.error('Error login', error)
            next(error)
        }
    }

}

module.exports = AuthController