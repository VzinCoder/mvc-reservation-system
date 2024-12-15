const RoomController = require('../controller/RoomController')
const { createRoomValidator, idParamValidation,editRoomValidator} = require('../validator/roomValidator')

const router = require('express').Router()

router.get('/', (req, res, next) => {
    RoomController.getRooms(req, res, next)
})

router.get('/create', (req, res, next) => {
    RoomController.getPageCreateRoom(req, res, next)
})

router.post('/create', createRoomValidator(), (req, res, next) => {
    RoomController.postCreateRoom(req, res, next)
})

router.post('/delete/:id',idParamValidation(),(req,res,next)=> {
    RoomController.postDeleteRoom(req,res,next)
})

router.get('/details/:id',idParamValidation(),(req,res,next)=> {
    RoomController.getPageRoomDetails(req,res,next)
})

router.get('/edit/:id',idParamValidation(),(req,res,next)=>{
    RoomController.getPageEditRoom(req,res,next)
})
router.post('/edit/:id',editRoomValidator(),(req,res,next)=>{
    RoomController.postEditRoom(req,res,next)
})

module.exports = router