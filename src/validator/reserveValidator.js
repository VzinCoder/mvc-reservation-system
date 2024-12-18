const { body} = require('express-validator')
const { validDateReserve } = require('../util/validDateReserve')

const createReserveValidator = () => {
    const roomIdValidation = body('room_id').isUUID()
        .withMessage('Room ID must be a valid UUID.')

    const customerIdValidation = body('customer_id').isUUID()
        .withMessage('Customer ID must be a valid UUID.')

    const checkinValidation = body('checkin_date')
        .notEmpty()
        .withMessage('Check-in date is required.')
        .isISO8601()
        .withMessage('Check-in must be a valid date (YYYY-MM-DD).')

    const checkoutValidation = body('checkout_date')
        .notEmpty()
        .withMessage('Check-out date is required.')
        .isISO8601()
        .withMessage('Check-out must be a valid date (YYYY-MM-DD).')
        .bail()
        .if((_, { req }) => {
            const { checkin_date } = req.body
            return checkin_date && /^\d{4}-\d{2}-\d{2}$/.test(checkin_date)
        })
        .custom((checkoutDate, { req }) => {
            const checkout = checkoutDate
            const checkin = req.body.checkin_date
            return validDateReserve({checkin,checkout})
        })

    return [roomIdValidation, customerIdValidation, checkinValidation, checkoutValidation]
}








module.exports = {
    createReserveValidator
}