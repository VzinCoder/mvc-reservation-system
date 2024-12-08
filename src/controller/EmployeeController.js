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
        const errors = validationResult(req)
       

        if (!errors.isEmpty()) {
            return res.redirect('/employee/create')
        }

        const { name, password, cpf, salary } = req.body
        const hashPass = await bcrypt.hash(password,10)
    
        const employee = {
            id: uuidv4(), 
            password:hashPass,
            name,
            cpf,
            salary
        }

        await EmployeeModel.create(employee)
        res.redirect('/employee/')
    }


}


module.exports = EmployeeController