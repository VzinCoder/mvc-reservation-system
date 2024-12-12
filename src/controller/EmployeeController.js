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
        const existsEmployee = await EmployeeModel.existsById(id)
        if (!errors.isEmpty() || !existsEmployee) {
            return res.redirect('/employee/')
        }

        await EmployeeModel.deleteById(id)
        res.redirect('/employee/')
    }


    static async getPageEmployeeDetails(req, res, next) {
        const { id } = req.params
        const employee = await EmployeeModel.findById(id)
        if (!employee) {
            return res.redirect('/employee/')
        }

        const dateFormated = format(employee.created_at, 'yyyy/MM/dd')
        const employeeDateFormated = { ...employee, created_at: dateFormated }
        res.render('employee/details', { employee: employeeDateFormated })
    }

    static async getPageEditEmployee(req, res, next) {
        const { id } = req.params
        const erros = validationResult(req)
        const errorMessage = 'Employee not found to edit'
        const viewPath = 'employee/edit'

        const viewModel = {
            employee: {},
            errorMessages: [errorMessage]
        }

        if (!erros.isEmpty()) {
            return res.render(viewPath, viewModel)
        }

        const employee = await EmployeeModel.findById(id)
        if (!employee) {
            return res.render(viewPath, viewModel)
        }
        res.render('employee/edit', { employee })
    }

    static async postEditEmployee(req, res, next) {
        const { id } = req.params
        const { name, password, cpf, salary } = req.body
        const errors = validationResult(req)

        // verify input
        if (!errors.isEmpty()) {
            const errorsArr = errors.array()
            const error = errorsArr[0]
            req.flash('error', error.msg)
            return res.redirect(`/employee/edit/${id}`)
        }

        //verify employee exists
        const employee = await EmployeeModel.findById(id)
        if (!employee) {
            return res.redirect(`/employee/edit/${id}`)
        }

        //Check if someone with this CPF already exists.
        const employeeFound = await EmployeeModel.findByCpf(cpf)
        if (employeeFound && employeeFound.id != employee.id) {
            req.flash('error', 'User with this CPF already exists. Please use a different CPF.')
            return res.redirect(`/employee/edit/${id}`)
        }

        //update data
        employee.name = name
        employee.cpf = cpf
        employee.salary = salary

        if (password) {
            const hashPass = await bcrypt.hash(password, 10)
            employee.password = hashPass
        }

        await EmployeeModel.updateEmployee(employee)
        req.flash('sucess', 'The employee has been successfully updated.')
        return res.redirect(`/employee/edit/${id}`)
    }


}


module.exports = EmployeeController