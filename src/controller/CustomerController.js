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
            logger.error(`Error to fetching customers:`, error)
            next(error)
        }
    }

    static getPageCreate(req, res, next) {
        logger.info('Rendering create customer page')
        try {
            res.render('customer/create')
        } catch (error) {
            logger.error(`Error rendering create customer page:`, error)
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
            logger.error(`Error creating customer:`, error)
            next(error)
        }
    }


    static async postDeleteCustomer(req, res, next) {
        logger.info('Deleting an customer')
        try {
            const { id } = req.params
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                logger.warn('Validation errors during deletion')
                res.redirect('/customer/')
            }

            const existsCustomer = await CustomerModel.existsById(id)
            if (!existsCustomer) {
                logger.warn(`Customer with ID ${id} not found`)
                return res.redirect('/customer/')
            }

            await CustomerModel.deleteById(id)
            logger.info(`Customer with ID ${id} successfully deleted`)
            return res.redirect('/customer/')
        } catch (error) {
            logger.error(`Error deleting customer:`, error)
            next(error)
        }
    }

    static async getPageDetailsCustomer(req, res, next) {
        logger.info('Fetching customer details')
        try {
            const { id } = req.params
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                logger.warn('Validation errors when fetching details')
                return res.redirect('/customer/')
            }

            const customer = await CustomerModel.findById(id)
            if (!customer) {
                logger.warn(`Customer with ID ${id} not found`)
                return res.redirect('/customer/')
            }
            const dateFormated = format(customer.created_at, 'yyyy/MM/dd')
            const customerDateFormated = { ...customer, created_at: dateFormated }
            logger.info(`Customer details fetched for ID ${id}`)
            res.render('customer/details', { customer: customerDateFormated })
        } catch (error) {
            logger.error(`Error fetching customer details:`, error)
            next(error)
        }
    }

    static async getPageEditCustomer(req, res, next) {
        logger.info('Rendering edit customer page')
        try {
            const { id } = req.params
            const errors = validationResult(req)
            const errorMessage = 'Customer not found to edit'
            const viewPath = 'customer/edit'
            const viewModel = {
                customer: {},
                errorMessages: [errorMessage]
            }

            if (!errors.isEmpty()) {
                logger.warn('Validation errors when rendering edit page')
                return res.render(viewPath, viewModel)
            }

            const customer = await CustomerModel.findById(id)
            if (!customer) {
                logger.warn(`Customer with ID ${id} not found for editing`)
                return res.render(viewPath, viewModel)
            }
            logger.info(`Rendering edit page for customer with ID ${id}`)
            res.render(viewPath, { customer })
        } catch (error) {
            logger.error(`Error rendering edit customer page:`, error)
            next(error)
        }
    }

    static async postEditCustomer(req, res, next) {
        logger.info('Editing an customer')
        try {
            const { id } = req.params
            const { name, cpf, email, phone } = req.body
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                const errorsArr = errors.array()
                const error = errorsArr[0]
                logger.warn(`Validation error: ${error.msg}`)
                req.flash('error', error.msg)
                return res.redirect(`/customer/edit/${id}`)
            }

            const customer = await CustomerModel.findById(id)
            if (!customer) {
                logger.warn(`Customer with ID ${id} not found for updating`)
                return res.redirect(`/customer/edit/${id}`)
            }

            const customerFound = await CustomerModel.findByCpf(cpf)
            if (customerFound && customerFound.id !== customer.id) {
                logger.warn(`CPF ${cpf} already in use by another customer`)
                req.flash('error', 'Customer with this CPF already exists. Please use a different CPF.')
                return res.redirect(`/customer/edit/${id}`)
            }

            // update customer properties
            Object.assign(customer, { name, email, cpf, phone })

            await CustomerModel.update(customer)
            logger.info(`Customer with ID ${id} successfully updated`)
            req.flash('sucess', 'The customer has been successfully updated.')
            res.redirect(`/customer/edit/${id}`)
        } catch (error) {
            logger.error(`Error editing customer:`, error)
            next(error)
        }
    }

}


module.exports = CustomerController