const CustomerController = require('../controller/CustomerController')
const { createCustomerValidator,idParamValidation} = require('../validator/customerValidator')

const router = require('express').Router()


router.get('/',(req,res,next) => {
    CustomerController.getCustomers(req,res,next)
})

router.get('/create',(req,res,next)=>{
    CustomerController.getPageCreate(req,res,next)
})

router.post('/create',createCustomerValidator(),(req,res,next)=>{
    CustomerController.postCreate(req,res,next)
})

router.post('/delete/:id',idParamValidation(),(req,res,next) => {
    CustomerController.postDeleteCustomer(req,res,next)
})


module.exports = router