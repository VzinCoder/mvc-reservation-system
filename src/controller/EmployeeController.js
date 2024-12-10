const { validationResult } = require('express-validator')
const EmployeeModel = require('../model/EmployeeModel')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')


class EmployeeController {


    static async getEmployee(req, res, next) {
        const employees = await EmployeeModel.findAll()
        console.log(employees)
        res.render('employee/list.ejs', { employees })
    }


    static async getPageCreateEmployee(req, res, next) {
        res.render('employee/create.ejs')
    }

    static async postCreateEmployee(req, res, next) {
        const { name, password, cpf, salary } = req.body

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            const errorsArr = errors.array()
            const error = errorsArr[0]
            req.flash('error', error.msg)
            return res.redirect('/employee/create')
        }

        const employeeFound = await EmployeeModel.findByCpf(cpf)
        if (employeeFound) {
            req.flash('error', 'User with this CPF already exists. Please use a different CPF.')
            return res.redirect('/employee/create')
        }

        const hashPass = await bcrypt.hash(password, 10)

        const employee = {
            id: uuidv4(),
            password: hashPass,
            name,
            cpf,
            salary
        }

        req.flash('sucess', `User with CPF ${cpf} has been successfully registered.`)
        await EmployeeModel.create(employee)
        res.redirect('/employee/create')
    }


}


module.exports = EmployeeController