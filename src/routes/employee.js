const router = require('express').Router()
const EmployeeController = require('../controller/EmployeeController')
const { createEmployeeValidator } = require('../validator/employeeValidator')

router.get('/', (req, res, next) => {
    EmployeeController.getEmployee(req, res, next)
})

router.get('/create', (req, res, next) => {
    EmployeeController.getPageCreateEmployee(req, res, next)
})

router.post('/create', createEmployeeValidator(), (req, res, next) => {
    EmployeeController.postCreateEmployee(req, res, next)
})


module.exports = router