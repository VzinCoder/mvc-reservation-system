const CustomerController = require('../controller/CustomerController')
const { createCustomerValidator, idParamValidation, editCustomerValidator, cpfParamValidation } = require('../validator/customerValidator')

const router = require('express').Router()


router.get('/', (req, res, next) => {
    CustomerController.getCustomers(req, res, next)
})

router.get('/create', (req, res, next) => {
    CustomerController.getPageCreate(req, res, next)
})

router.post('/create', createCustomerValidator(), (req, res, next) => {
    CustomerController.postCreate(req, res, next)
})

router.post('/delete/:id', idParamValidation(), (req, res, next) => {
    CustomerController.postDeleteCustomer(req, res, next)
})

router.get('/details/:id', idParamValidation(), (req, res, next) => {
    CustomerController.getPageDetailsCustomer(req, res, next)
})

router.get('/edit/:id', idParamValidation(), (req, res, next) => {
    CustomerController.getPageEditCustomer(req, res, next)
})

router.post('/edit/:id', editCustomerValidator(), (req, res, next) => {
    CustomerController.postEditCustomer(req, res, next)
})

router.get('/json/:cpf', cpfParamValidation(), (req, res, next) => {
    CustomerController.getCustomerByCpfJson(req, res, next)
})

module.exports = router