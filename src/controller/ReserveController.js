const logger = require("../util/logger")
const { validationResult } = require("express-validator")
const RoomModel = require("../model/RoomModel")
const CustomerModel = require("../model/CustomerModel")
const ReserveModel = require("../model/ReserveModel")
const { parseISO, startOfDay, differenceInDays } = require('date-fns')
const { v4: uuidv4 } = require('uuid')


class ReserveController {

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
            req.flash('success', 'The reservation has been successfully registered.')
            res.redirect('/reserve/create')
        } catch (error) {
            logger.error('Error to create reserve', error)
            next(error)
        }
    }

}

module.exports = ReserveController