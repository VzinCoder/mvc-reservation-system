const logger = require("../util/logger")


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

}

module.exports = ReserveController