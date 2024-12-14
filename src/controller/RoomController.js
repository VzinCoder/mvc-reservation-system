const { validationResult } = require("express-validator")
const logger = require("../util/logger")
const RoomModel = require("../model/RoomModel")
const { v4: uuidv4 } = require('uuid');

class RoomController {

    static getRooms(req, res, next) {
        try {
            logger.info('Fetching all rooms')
            res.render('room/list', { rooms: [] })
        } catch (error) {
            logger.error('Error fetching rooms:', error)
            next(error)
        }
    }

    static getPageCreateRoom(req, res, next) {
        try {
            logger.info('Rendering create room page')
            res.render('room/create.ejs')
        } catch (error) {
            logger.error(`Error rendering create room page:`, error)
            next(error)
        }
    }

    static async postCreateRoom(req, res, next) {
        try {
            logger.info('Creating a new room')
            const { room_code: code } = req.body
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                const errorsArr = errors.array()
                const error = errorsArr[0]
                logger.warn(`Validation error: ${error.msg}`)
                req.flash('error', error.msg)
                return res.redirect('/room/create')
            }

            const roomFound = await RoomModel.findByCode(code)
            if (roomFound) {
                logger.warn(`A room with the code ${code} already exists.`)
                req.flash('error', 'Room with this code already exists. Please use a different code.')
                return res.redirect('/room/create')
            }

            const newRoom = {
                id: uuidv4(),
                beds: req.body.beds,
                daily_rate: req.body.daily_rate,
                type: req.body.type,
                bathrooms: req.body.bathrooms,
                floor: req.body.floor,
                room_number: req.body.room_number,
                room_code: code
            }

            await RoomModel.create(newRoom)
            logger.info(`Room with code ${code} successfully created`)
            req.flash('sucess', `room with code ${code} has been successfully registered.`)
            res.redirect('/room/create')
        } catch (error) {
            logger.error(`Error creating room:`, error)
            next(error)
        }
    }
}


module.exports = RoomController