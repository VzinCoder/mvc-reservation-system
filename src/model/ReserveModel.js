const { pool } = require('../db/conn')

class ReserveModel {


    static async create(reserve) {
        const query = `INSERT INTO 
        reserve (id,room_id,customer_id,employee_id,check_in,check_out,total_price) 
        VAlUES ($1,$2,$3,$4,$5,$6,$7)`

        const values = [
            reserve.id,
            reserve.roomId,
            reserve.customerId,
            reserve.employeeId,
            reserve.checkin,
            reserve.checkout,
            reserve.totalPrice
        ]

        const { rowCount, command } = await pool.query(query, values)

        if (rowCount === 0) {
            throw new Error(`Failed to create reserve : ${command}`)
        }
        return true
    }


}

module.exports = ReserveModel