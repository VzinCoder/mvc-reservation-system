const { pool } = require('../db/conn')


class RoomModel {


    static async create(room) {
        const query = `INSERT INTO room 
        (id, daily_rate, beds, type, bathrooms, floor, room_number, room_code)
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8)`

        const values = [
            room.id,
            room.beds, 
            room.daily_rate,
            room.type,
            room.bathrooms,
            room.floor,
            room.room_number,
            room.room_code
        ]

        const result = await pool.query(query,values)

        if (result.rowCount === 0) {
            throw new Error(`Failed to create room : ${result.command}`)
        }
        return true
    }

    static async findByCode(code){
        const query = `SELECT * FROM room where room_code = $1`
        const result = await pool.query(query,[code])
        return result.rows[0] || null
    }


}

module.exports = RoomModel