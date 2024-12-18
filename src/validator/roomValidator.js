const { body, param, query } = require('express-validator')
const {validDateReserve} = require('../util/validDateReserve')

const ROOM_TYPES = {
    SINGLE: { beds: 1 },
    DOUBLE: { beds: 2 },
    FAMILY: { beds: 3 },
}

const idParamValidation = () => param('id').isUUID()


const roomValidator = () => {
    const daily_rateValidation = body('daily_rate')
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('Daily rate must be a valid decimal value with up to 2 decimal places.')
        .notEmpty()
        .withMessage('Daily rate is required.')
        .isFloat({ min: 0.01 })
        .withMessage('Daily rate must be at least 0.01.')

    const typeValidation = body('type')
        .isIn(Object.keys(ROOM_TYPES))
        .withMessage('Invalid room type.');

    const bedsValidation = body('beds')
        .notEmpty()
        .withMessage('Beds field is required.')
        .bail()
        .isInt({ min: 1 })
        .withMessage('Beds must be a positive integer.')
        .bail()
        .custom((value, { req }) => {
            const valueConverted = Number(value)
            const roomType = req.body.type;
            if (!ROOM_TYPES[roomType]) {
                throw new Error('Invalid room type.');
            }
            const { beds } = ROOM_TYPES[roomType]

            if (roomType === 'FAMILY' && valueConverted < beds) {
                throw new Error('Family rooms require at least 3 beds.')
            } else if (roomType !== 'FAMILY' && valueConverted !== beds) {
                console.log(valueConverted, beds, roomType)
                throw new Error(`Rooms of type ${roomType} must have exactly ${beds} bed(s).`)
            }

            return true
        })

    const floorValidation = body('floor')
        .isInt({ min: 1, max: 26 })
        .withMessage('Floor must be an integer between 1 and 26.')
        .notEmpty()
        .withMessage('Floor field is required.');

    const room_numberValidation = body('room_number')
        .isInt({ min: 1 })
        .withMessage('Room number must be a positive integer.')
        .notEmpty()
        .withMessage('Room number field is required.')


    const validCode = (value, { req }) => {
        const floor = parseInt(req.body.floor)
        const roomNumber = parseInt(req.body.room_number)

        const floorLetter = String.fromCharCode(64 + floor)
        const expectedCode = `${floorLetter}${roomNumber.toString().padStart(2, '0')}`

        if (value !== expectedCode) {
            throw new Error(
                `Invalid Room Code. Expected: ${expectedCode}`
            )
        }

        return true
    }

    const room_codeValidation = body('room_code')
        .if(body('floor').exists())
        .if(body('room_number').exists())
        .custom(validCode)

    return [
        daily_rateValidation,
        bedsValidation,
        typeValidation,
        floorValidation,
        room_numberValidation,
        room_codeValidation
    ]
}

const createRoomValidator = () => {
    return [...roomValidator()]
}

const editRoomValidator = () => {

    return [idParamValidation(), ...roomValidator()]
}

const getRoomsAvailableJsonValidator = () => {
    const checkinValidation = query('checkin')
        .exists().withMessage('Check-in date is required.')
        .isISO8601().withMessage('Check-in must be a valid date (YYYY-MM-DD).')

    const checkoutValidation = query('checkout')
        .exists().withMessage('Check-out date is required.')
        .isISO8601().withMessage('Check-out must be a valid date (YYYY-MM-DD).')
        .bail()
        .if((_, { req }) => {
            const { checkin } = req.query
            return checkin && /^\d{4}-\d{2}-\d{2}$/.test(checkin)
        })
        .custom((checkoutDate, { req }) => {
            const checkout = checkoutDate
            const checkin = req.query.checkin
           return validDateReserve({checkin,checkout})
        })

    const bedsValidation = query('beds')
        .optional()
        .isInt({ min: 1 }).withMessage('Number of beds must be at least 1.')
        .toInt()

    const typeValidation = query('type')
        .optional()
        .isIn(['SINGLE', 'DOUBLE', 'FAMILY'])
        .withMessage('Room type must be "SINGLE", "DOUBLE", or "FAMILY".')

    return [checkinValidation, checkoutValidation, bedsValidation, typeValidation]
}

module.exports = {
    createRoomValidator,
    idParamValidation,
    editRoomValidator,
    getRoomsAvailableJsonValidator
}