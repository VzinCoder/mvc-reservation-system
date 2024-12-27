const logger = require("../util/logger")
const { validationResult } = require("express-validator")
const RoomModel = require("../model/RoomModel")
const CustomerModel = require("../model/CustomerModel")
const ReserveModel = require("../model/ReserveModel")
const { parseISO, startOfDay, differenceInDays } = require('date-fns')
const { v4: uuidv4 } = require('uuid')


class ReserveController {

    static STATUS_RESERVE = {
        CONFIRMED: 'CONFIRMED',
        FINALIZED: 'FINALIZED',
        CANCELLED: 'CANCELLED'
    }

    static async getReserves(req, res, next) {
        try {
            logger.info('Fetching all reserves')
            const reserves = await ReserveModel.findAll()
            res.render('reserve/list', { reserves })
        } catch (error) {
            logger.error('Error fetching reserves:', error)
            next(error)
        }
    }

    static async getPageCreateReserve(req, res, next) {
        try {
            logger.info('Rendering page create reserve')
            res.render('reserve/create')
        } catch (error) {
            logger.error('Error rendering page create reserve', error)
            next(error)
        }
    }


    static async postCreateReserve(req, res, next) {
        try {
            logger.info('Creating a new reserve')
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                const errorsArr = errors.array()
                const error = errorsArr[0]
                logger.warn(`Validation error: ${error.msg}`)
                req.flash('error', error.msg)
                return res.redirect('/reserve/create')
            }

            const { room_id, customer_id, checkin_date, checkout_date } = req.body

            const customerFound = await CustomerModel.findById(customer_id)
            if (!customerFound) {
                logger.warn(`Customer with ID: ${customer_id} not found.`)
                req.flash('error', 'The customer record could not be found.')
                return res.redirect('/reserve/create')
            }

            const roomFound = await RoomModel.findById(room_id)
            if (!roomFound) {
                logger.warn(`Room with ID: ${room_id} not found.`)
                req.flash('error', 'The selected room does not exist or is unavailable.')
                return res.redirect('/reserve/create')
            }

            const isRoomAvailable = await RoomModel.isAvailableRoomBy({
                id: room_id,
                checkin: checkin_date,
                checkout: checkout_date
            })

            if (!isRoomAvailable) {
                logger.warn(`Room with ID: ${room_id} is unavailable for the selected dates.`)
                req.flash('error', 'The selected room is unavailable for the chosen dates.')
                return res.redirect('/reserve/create')
            }

            const parsedCheckin = startOfDay(parseISO(checkin_date))
            const parsedCheckout = startOfDay(parseISO(checkout_date))
            const qtyDays = differenceInDays(parsedCheckout, parsedCheckin)
            const totalPrice = roomFound.daily_rate * qtyDays

            const userId = req.session.user.id
            const reserve = {
                id: uuidv4(),
                employeeId: userId,
                customerId: customer_id,
                roomId: room_id,
                checkin: parsedCheckin,
                checkout: parsedCheckout,
                totalPrice
            }

            await ReserveModel.create(reserve)
            logger.info('Reserve successfully created')
            req.flash('sucess', 'The reservation has been successfully registered.')
            res.redirect('/reserve/create')
        } catch (error) {
            logger.error('Error to create reserve', error)
            next(error)
        }
    }

    static async getPageReserveDetails(req, res, next) {
        try {
            logger.info('Fetching reserve details')
            const { id } = req.params
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                logger.warn('Validation errors when fetching details')
                return res.redirect('/reserve/')
            }

            const reserveFound = await ReserveModel.findById(id)
            if (!reserveFound) {
                logger.warn(`Reserve with ID ${id} not found`)
                return res.redirect('/reserve/')
            }

            logger.info(`Reserve details fetched for ID ${id}`)
            res.render('reserve/details', { reserve: reserveFound })
        } catch (error) {
            logger.error('Error fetching reserve:', error)
            next(error)
        }
    }


    static async postFinalizeReserve(req, res, next) {
        logger.info('Fetching reserve details')
        const { id } = req.params
        const { path } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            logger.warn('Validation errors when fetching details')
            return res.redirect('/reserve')
        }

        const reserveFound = await ReserveModel.findById(id)
        if (!reserveFound) {
            logger.warn(`Reserve with ID ${id} not found`)
            return res.redirect('/reserve')
        }

        const statusCanceled = ReserveController.STATUS_RESERVE.FINALIZED
        await ReserveModel.changeStatusById({ id, status: statusCanceled })
        logger.info(`Reservation with ID ${id} finalized successfully`)

        if (path !== '/reserve/') {
            const viewPath = `${path}/${id}`
            req.flash('sucess', 'Reservation finalized successfully.')
            return res.redirect(viewPath)
        }
        return res.redirect('/reserve')
    }

    static async postCancelReserve(req, res, next) {
        logger.info('Fetching reserve details')
        const { id } = req.params
        const { path } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            logger.warn('Validation errors when fetching details')
            return res.redirect('/reserve')
        }

        const reserveFound = await ReserveModel.findById(id)
        if (!reserveFound) {
            logger.warn(`Reserve with ID ${id} not found`)
            return res.redirect('/reserve')
        }

        const statusCanceled = ReserveController.STATUS_RESERVE.CANCELLED
        await ReserveModel.changeStatusById({ id, status: statusCanceled })
        logger.info(`Reservation with ID ${id} canceled successfully`)

        if (path !== '/reserve/') {
            const viewPath = `${path}/${id}`
            req.flash('sucess', 'Reservation canceled successfully.')
            return res.redirect(viewPath)
        }
        return res.redirect('/reserve')
    }

}

module.exports = ReserveController