const { validationResult } = require('express-validator')
const EmployeeModel = require('../model/EmployeeModel')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')
const { format } = require('date-fns');

class EmployeeController {


    static async getEmployees(req, res, next) {
        const employees = await EmployeeModel.findAll()
        const employeesDateFormated = employees.map((employee) => {
            const dateFormated = format(employee.created_at, 'yyyy/MM/dd')
            return { ...employee, created_at: dateFormated }
        })
        res.render('employee/list.ejs', { employees: employeesDateFormated })
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

        await EmployeeModel.create(employee)
        req.flash('sucess', `User with CPF ${cpf} has been successfully registered.`)
        res.redirect('/employee/create')
    }

    static async postDeleteEmployee(req, res, next) {
        const { id } = req.params
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.redirect('/employee/')
        }

        await EmployeeModel.deleteById(id)
        res.redirect('/employee/')
    }


    static async getPageEmployeeDetails(req, res, next) {
        const { id } = req.params
        const employee = await EmployeeModel.findEmployeeById(id)
        if (!employee) {
            return res.redirect('/employee/')
        }

        const dateFormated = format(employee.created_at, 'yyyy/MM/dd')
        const employeeDateFormated = { ...employee, created_at: dateFormated }
        res.render('employee/details', { employee: employeeDateFormated })
    }

    static async getPageEditEmployee(req, res, next) {
        const { id } = req.params
        const employee = await EmployeeModel.findEmployeeById(id)
        if (!employee) {
            return res.redirect('/employee/')
        }
        res.render('employee/edit', { employee })
    }


}


module.exports = EmployeeController