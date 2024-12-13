const { validationResult } = require("express-validator")
const logger = require("../util/logger")
const CustomerModel = require("../model/CustomerModel")
const { format } = require('date-fns');
const { v4: uuidv4 } = require('uuid');

class CustomerController {

    static async getCustomers(req, res, next) {
        logger.info('Fetching all customer')
        try {
            const customers = await CustomerModel.findAll()
            logger.info(`Found ${customers.length} customers`)
            const customersDateFormated = customers.map((customer) => {
                const dateFormated = format(customer.created_at, 'yyyy/MM/dd')
                return { ...customer, created_at: dateFormated }
            })
            res.render('customer/list', { customers: customersDateFormated })
        } catch (error) {
            logger.error(`Error to fetching customers ${error.message}`)
            next(error)
        }
    }

    static getPageCreate(req, res, next) {
        logger.info('Rendering create customer page')
        try {
            res.render('customer/create')
        } catch (e) {
            logger.error(`Error rendering create customer page: ${error.message}`)
            next(error)
        }
    }

    static async postCreate(req, res, next) {
        logger.info('Creating a new customer')
        try {
            const errors = validationResult(req)
            const { name, phone, email, cpf } = req.body

            if (!errors.isEmpty()) {
                const errosArr = errors.array()
                const error = errosArr[0]
                logger.warn(`Validation error: ${error.msg}`)
                req.flash('error', error.msg)
                return res.redirect('/customer/create')
            }

            const customerFound = await CustomerModel.findByCpf(cpf)
            if (customerFound) {
                logger.warn(`Customer with CPF ${cpf} already exists`)
                req.flash('error', 'Customer with this CPF already exists. Please use a different CPF.')
                return res.redirect('/customer/create')
            }

            const customer = { id: uuidv4(), name, phone, email, cpf }
            await CustomerModel.create(customer)
            logger.info(`Customer with CPF ${cpf} successfully created`)
            req.flash('sucess', `Customer with CPF ${cpf} has been successfully registered.`)
            res.redirect('/customer/create')
        } catch (error) {
            logger.error(`Error creating customer ${error.message}`)
            next(error)
        }
    }

}


module.exports = CustomerController