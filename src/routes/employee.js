const router = require('express').Router()
const EmployeeController = require('../controller/EmployeeController')
const { createEmployeeValidator,idParamValidation} = require('../validator/employeeValidator')

router.get('/', (req, res, next) => {
    EmployeeController.getEmployees(req, res, next)
})

router.get('/create', (req, res, next) => {
    EmployeeController.getPageCreateEmployee(req, res, next)
})

router.post('/create', createEmployeeValidator(), (req, res, next) => {
    EmployeeController.postCreateEmployee(req, res, next)
})

router.post('/delete/:id',idParamValidation(),(req,res,next)=>{
    EmployeeController.postDeleteEmployee(req,res,next)
})

router.get('/details/:id',idParamValidation(),(req,res,next)=>{
    EmployeeController.getPageEmployeeDetails(req,res,next)
})

router.get('/edit/:id',idParamValidation(),(req,res,next) => {
    EmployeeController.getPageEditEmployee(req,res,next)
})
module.exports = router