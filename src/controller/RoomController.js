const { validationResult } = require("express-validator")
const logger = require("../util/logger")
const RoomModel = require("../model/RoomModel")
const { v4: uuidv4 } = require('uuid');

class RoomController {

    static async getRooms(req, res, next) {
        try {
            logger.info('Fetching all rooms')
            const rooms = await RoomModel.findAll()
            res.render('room/list', { rooms: rooms })
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
            console.log(newRoom)
            await RoomModel.create(newRoom)
            logger.info(`Room with code ${code} successfully created`)
            req.flash('sucess', `room with code ${code} has been successfully registered.`)
            res.redirect('/room/create')
        } catch (error) {
            logger.error(`Error creating room:`, error)
            next(error)
        }
    }

    static async postDeleteRoom(req, res, next) {
        try {
            logger.info('Deleting an room')
            const { id } = req.params
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                logger.warn('Validation errors during deletion')
                return res.redirect('/room/')
            }

            const room = RoomModel.findById(id)
            if (!room) {
                logger.warn(`Room with ID ${id} not found`)
                return res.redirect('/room/')
            }

            await RoomModel.deleteById(id)
            logger.info(`Room with ID ${id} successfully deleted`)
            return res.redirect('/room/')
        } catch (error) {
            logger.error(`Error deleting room:`, error)
            next(error)
        }

    }

    static async getPageRoomDetails(req, res, next) {
        try {
            logger.info('Fetching room details')
            const { id } = req.params
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                logger.warn('Validation errors when fetching details')
                return res.redirect('/room/')
            }

            const roomFound = await RoomModel.findById(id)
            if (!roomFound) {
                logger.warn(`Room with ID ${id} not found`)
                return res.redirect('/room/')
            }

            logger.info(`Room details fetched for ID ${id}`)
            return res.render('room/details', { room: roomFound })
        } catch (error) {
            logger.error(`Error fetching room details:`, error)
            next(error)
        }
    }
}


module.exports = RoomController