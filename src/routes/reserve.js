const ReserveController = require('../controller/ReserveController')

const router = require('express').Router()


router.get('/create',(req,res,next)=>{
    ReserveController.getPageCreateReserve(req,res,next)
})

module.exports = router