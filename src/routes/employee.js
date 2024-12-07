const router = require('express').Router()
const EmployeeController = require('../controller/EmployeeController')

router.get('/', (req, res, next) => {
    EmployeeController.getEmployee(req, res, next)
})




module.exports = router