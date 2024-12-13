const CustomerController = require('../controller/CustomerController')

const router = require('express').Router()


router.get('/',(req,res,next) => {
    CustomerController.getCustomers(req,res,next)
})

router.get('/create',(req,res,next)=>{
    CustomerController.getPageCreate(req,res,next)
})



module.exports = router