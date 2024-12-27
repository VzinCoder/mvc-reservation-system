const { pool } = require('../db/conn')

class ReserveModel {


    static async findAll() {
        const query = `SELECT json_build_object(
                        'customer',json_build_object('name',c.name,'cpf',c.cpf),
                        'employee',json_build_object('name',ep.name,'cpf',ep.cpf),
                        'room',json_build_object('code',ro.room_code,'daily_rate',ro.daily_rate),
                        'id',re.id,
                        'check_in',re.check_in,
                        'check_out',re.check_out,
                        'total',re.total_price,
                        'status',re.status,
                        'created_at',re.created_at
                        ) as reserve_json from reserve re 
                    INNER JOIN customer c ON re.customer_id = c.id
                    INNER JOIN room ro ON re.room_id = ro.id
                    INNER JOIN employee ep ON re.employee_id = ep.id`
        const { rows } = await pool.query(query)
        return rows.map(({ reserve_json }) => ({ ...reserve_json }))
    }

    static async findById(id) {
        const query = `SELECT json_build_object(
            'customer',json_build_object('name',c.name,'cpf',c.cpf),
            'employee',json_build_object('name',ep.name,'cpf',ep.cpf),
            'room',json_build_object('code',ro.room_code,'daily_rate',ro.daily_rate,'type',ro.type,'beds',ro.beds),
            'id',re.id,
            'check_in',re.check_in,
            'check_out',re.check_out,
            'total',re.total_price,
            'status',re.status,
            'created_at',re.created_at
            ) as reserve_json from reserve re 
        INNER JOIN customer c ON re.customer_id = c.id
        INNER JOIN room ro ON re.room_id = ro.id
        INNER JOIN employee ep ON re.employee_id = ep.id
        WHERE re.id = $1
        `
        const { rows } = await pool.query(query,[id])
        return rows[0] ? {...rows[0].reserve_json} : null
    }


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


    static async changeStatusById({status,id}){
        const query = `Update reserve set status = $1 where id = $2`
        const {rowCount} = await pool.query(query,[status,id])
        if (rowCount === 0) {
            throw new Error(`Failed to change status reserve : ${command}`)
        }
        return true
    }

}

module.exports = ReserveModel