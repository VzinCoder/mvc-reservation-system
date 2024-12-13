const logger = require("../util/logger")

class CustomerController{

    static getCustomers(req,res,next){
        logger.info('Fetching all customer')
        try{
            res.render('customer/list',{customers:[]})
        }catch(error){
            logger.error(`Error to fetching customers ${error.message}`)
            next(error)
        }
    }

    static getPageCreate(req,res,next){
        logger.info('Rendering create customer page')
        try{
            res.render('customer/create')
        }catch(e){
            logger.error(`Error rendering create customer page: ${error.message}`)
            next(error)
        }
    }

}


module.exports = CustomerController