const { validationResult } = require('express-validator')
const EmployeeModel = require('../model/EmployeeModel')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')
const { format } = require('date-fns');
const logger = require('../util/logger');

class EmployeeController {


    static async getEmployees(req, res, next) {
        logger.info('Fetching all employees')
        try {
            const employees = await EmployeeModel.findAll()
            logger.info(`Found ${employees.length} employees`)
            const employeesDateFormated = employees.map((employee) => {
                const dateFormated = format(employee.created_at, 'yyyy/MM/dd')
                return { ...employee, created_at: dateFormated }
            })
            res.render('employee/list.ejs', { employees: employeesDateFormated })
        } catch (error) {
            logger.error(`Error fetching employees: ${error.message}`);
            next(error)
        }
    }


    static async getPageCreateEmployee(req, res, next) {
        logger.info('Rendering create employee page')
        try {
            res.render('employee/create.ejs')
        } catch (error) {
            logger.error(`Error rendering create employee page: ${error.message}`)
            next(error)
        }
    }

    static async postCreateEmployee(req, res, next) {
        logger.info('Creating a new employee')
        try {
            const { name, password, cpf, salary } = req.body

            const errors = validationResult(req)
    
            if (!errors.isEmpty()) {
                const errorsArr = errors.array()
                logger.warn(`Validation error: ${error.msg}`)
                const error = errorsArr[0]
                req.flash('error', error.msg)
                return res.redirect('/employee/create')
            }
    
            const employeeFound = await EmployeeModel.findByCpf(cpf)
            if (employeeFound) {
                logger.warn(`Employee with CPF ${cpf} already exists`)
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
            logger.info(`Employee with CPF ${cpf} successfully created`)
            req.flash('sucess', `User with CPF ${cpf} has been successfully registered.`)
            res.redirect('/employee/create')
        } catch (error) {
            logger.error(`Error creating employee: ${error.message}`)
            next(error)
        }
    }

    static async postDeleteEmployee(req, res, next) {
        logger.info('Deleting an employee')
        try {
            const { id } = req.params
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                logger.warn('Validation errors during deletion')
                return res.redirect('/employee/')
            }
    
            const existsEmployee = await EmployeeModel.existsById(id)
            if (!existsEmployee) {
                logger.warn(`Employee with ID ${id} not found`)
                return res.redirect('/employee/')
            }
    
            await EmployeeModel.deleteById(id)
            logger.info(`Employee with ID ${id} successfully deleted`)
            res.redirect('/employee/')
        } catch (error) {
            logger.error(`Error deleting employee: ${error.message}`)
            next(error)
        }
    }


    static async getPageEmployeeDetails(req, res, next) {
        logger.info('Fetching employee details')
        try {
            const { id } = req.params
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                logger.warn('Validation errors when fetching details')
                return res.redirect('/employee/')
            }
    
            const employee = await EmployeeModel.findById(id)
            if (!employee) {
                logger.warn(`Employee with ID ${id} not found`)
                return res.redirect('/employee/')
            }
    
            const dateFormated = format(employee.created_at, 'yyyy/MM/dd')
            const employeeDateFormated = { ...employee, created_at: dateFormated }
            logger.info(`Employee details fetched for ID ${id}`)
            res.render('employee/details', { employee: employeeDateFormated })
        } catch (error) {
            logger.error(`Error fetching employee details: ${error.message}`)
            next(error)
        }
    }

    static async getPageEditEmployee(req, res, next) {
        logger.info('Rendering edit employee page')
        try {
            const { id } = req.params
            const erros = validationResult(req)
            const errorMessage = 'Employee not found to edit'
            const viewPath = 'employee/edit'
    
            const viewModel = {
                employee: {},
                errorMessages: [errorMessage]
            }
    
            if (!erros.isEmpty()) {
                logger.warn('Validation errors when rendering edit page')
                return res.render(viewPath, viewModel)
            }
    
            const employee = await EmployeeModel.findById(id)
            if (!employee) {
                logger.warn(`Employee with ID ${id} not found for editing`)
                return res.render(viewPath, viewModel)
            }
            logger.info(`Rendering edit page for employee with ID ${id}`)
            res.render('employee/edit', { employee })
        } catch (error) {
            logger.error(`Error rendering edit employee page: ${error.message}`)
            next(error)
        }
    }

    static async postEditEmployee(req, res, next) {
        logger.info('Editing an employee')
        try {
            const { id } = req.params
            const { name, password, cpf, salary } = req.body
            const errors = validationResult(req)
    
            // verify input
            if (!errors.isEmpty()) {
                const errorsArr = errors.array()
                const error = errorsArr[0]
                logger.warn(`Validation error: ${error.msg}`)
                req.flash('error', error.msg)
                return res.redirect(`/employee/edit/${id}`)
            }
    
            //verify employee exists
            const employee = await EmployeeModel.findById(id)
            if (!employee) {
                logger.warn(`Employee with ID ${id} not found for updating`)
                return res.redirect(`/employee/edit/${id}`)
            }
    
            //Check if someone with this CPF already exists.
            const employeeFound = await EmployeeModel.findByCpf(cpf)
            if (employeeFound && employeeFound.id != employee.id) {
                logger.warn(`CPF ${cpf} already in use by another employee`)
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
            logger.info(`Employee with ID ${id} successfully updated`)
            req.flash('sucess', 'The employee has been successfully updated.')
            return res.redirect(`/employee/edit/${id}`)
        } catch (error) {
            logger.error(`Error editing employee: ${error.message}`)
            next(error)
        }
    }
}

module.exports = EmployeeController