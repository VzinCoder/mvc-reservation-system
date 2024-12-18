const ReserveController = require('../controller/ReserveController')
const { createReserveValidator} = require('../validator/reserveValidator')
const router = require('express').Router()


router.get('/create',(req,res,next)=>{
    ReserveController.getPageCreateReserve(req,res,next)
})

router.post('/create',createReserveValidator(),(req,res,next)=>{
    ReserveController.postCreateReserve(req,res,next)
})
module.exports = router