const logger = require("../util/logger")
const { validationResult } = require("express-validator")

class ReserveController{

    static async getPageCreateReserve(req,res,next){
        try{
            logger.info('Rendering page create reserve')
            res.render('reserve/create')
        }catch(error){
            logger.error('Error rendering page create reserve',error)
            next(error)
        }
    }


    static async postCreateReserve(req,res,next){
        try{
            logger.info('Creating a new reserve')
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                const errorsArr = errors.array()
                const error = errorsArr[0]
                logger.warn(`Validation error: ${error.msg}`)
                req.flash('error', error.msg)
                return res.redirect('/reserve/create')
            }
            res.redirect('/reserve/create')
        }catch(error){
            logger.error('Error to create reserve',error)
        }
    }

}

module.exports = ReserveController