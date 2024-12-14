const { pool } = require('../db/conn')


class CustomerModel {

    static async findAll() {
        const { rows } = await pool.query(`SELECT * FROM customer`)
        return rows
    }

    static async create({ id, name, phone, cpf, email }) {
        const query = `INSERT INTO customer (id,name,phone,cpf,email) values ($1,$2,$3,$4,$5)`
        const result = await pool.query(query, [id, name, phone, cpf, email])
        if (result.rowCount === 0) {
            throw new Error(`Failed to create customer : ${result.command}`)
        }
        return true
    }

    static async findByCpf(cpf) {
        const query = `SELECT * FROM customer WHERE cpf = $1`
        const result = await pool.query(query, [cpf])
        return result.rows[0] || null
    }

    static async deleteById(id) {
        const query = `DELETE FROM customer where id = $1`
        const result = await pool.query(query, [id])
        if (result.rowCount === 0) {
            throw new Error(`Failed to delete customer : ${result.command}`)
        }
        return true
    }

    static async existsById(id) {
        const query = "Select * from customer where id = $1"
        const result = await pool.query(query, [id])
        return Boolean(result.rows[0])
    }

    static async findById(id) {
        const query = "Select * from customer where id = $1"
        const result = await pool.query(query, [id])
        return result.rows[0] || null
    }

    static async update({ id, name, email, cpf, phone }) {
        const query = `Update customer SET name = $1, email = $2, cpf = $3, phone = $4 where id = $5`
        const result = await pool.query(query, [name, email, cpf, phone, id])
        if(result.rowCount === 0){
            throw new Error(`Failed to update customer : ${result.command}`)
        }
        return true
    }
}

module.exports = CustomerModel