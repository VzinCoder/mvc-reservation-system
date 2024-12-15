const AuthController = require('../controller/AuthController')
const { loginValidator } = require('../validator/authValidator')

const router = require('express').Router()


router.get('/login', (req, res, next) => {
    AuthController.getPageLogin(req, res, next)
})

router.post('/login',loginValidator(),(req,res,next)=>{
    AuthController.postLogin(req,res,next)
})

module.exports = router