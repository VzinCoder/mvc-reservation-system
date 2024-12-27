const ReserveController = require('../controller/ReserveController')
const { createReserveValidator, idParamValidation,finalizeValidator,cancelValidator } = require('../validator/reserveValidator')
const router = require('express').Router()

router.get('/', (req, res, next) => {
    ReserveController.getReserves(req, res, next)
})

router.get('/create', (req, res, next) => {
    ReserveController.getPageCreateReserve(req, res, next)
})

router.post('/create', createReserveValidator(), (req, res, next) => {
    ReserveController.postCreateReserve(req, res, next)
})

router.get('/details/:id', idParamValidation(), (req, res, next) => {
    ReserveController.getPageReserveDetails(req, res, next)
})

router.post('/finalize/:id',finalizeValidator(),(req,res,next)=> {
    ReserveController.postFinalizeReserve(req,res,next)
})
router.post('/cancel/:id',cancelValidator(),(req,res,next)=>{
    ReserveController.postCancelReserve(req,res,next)
})

module.exports = router