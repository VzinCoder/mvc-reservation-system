const { pool } = require('../db/conn')


class RoomModel {

    static async findAll() {
        const { rows } = await pool.query(`SELECT * FROM room`)
        return rows
    }

    static async create(room) {
        const query = `INSERT INTO room 
        (id, daily_rate, beds, type, bathrooms, floor, room_number, room_code)
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8)`

        const values = [
            room.id,
            room.daily_rate,
            room.beds,
            room.type,
            room.bathrooms,
            room.floor,
            room.room_number,
            room.room_code
        ]

        const { rowCount, command } = await pool.query(query, values)

        if (rowCount === 0) {
            throw new Error(`Failed to create room : ${command}`)
        }
        return true
    }

    static async findByCode(code) {
        const query = `SELECT * FROM room where room_code = $1`
        const { rows } = await pool.query(query, [code])
        return rows[0] || null
    }

    static async deleteById(id) {
        const query = `DELETE FROM room where id = $1`
        const { rowCount, command } = await pool.query(query, [id])
        if (rowCount === 0) {
            throw new Error(`Failed to delete employee : ${command}`)
        }
        return true
    }

    static async findById(id) {
        const query = `SELECT * FROM room where id = $1`
        const { rows } = await pool.query(query, [id])
        return rows[0] || null
    }

    static async update(room) {
        const query = `UPDATE room 
        SET daily_rate = $1, beds = $2, type = $3, bathrooms = $4, floor = $5, 
        room_number = $6,room_code = $7 WHERE id = $8`

        const values = [
            room.daily_rate,
            room.beds,
            room.type,
            room.bathrooms,
            room.floor,
            room.room_number,
            room.room_code,
            room.id
        ]

        const { rowCount, command } = await pool.query(query, values)
        if (rowCount === 0) {
            throw new Error(`Failed to update employee : ${command}`)
        }
        return true
    }
}

module.exports = RoomModel