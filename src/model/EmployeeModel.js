const { pool } = require('../db/conn')

class EmployeeModel {

    static async findAll() {
        const { rows } = await pool.query(`SELECT * FROM employee`)
        return rows
    }

    static async create({ id, name, password, cpf, salary }) {
        const query = `INSERT INTO employee (id,name,password,cpf,salary) values ($1,$2,$3,$4,$5)`
        const result = await pool.query(query, [id, name, password, cpf, salary])
        if (result.rowCount === 0) {
            throw new Error('Failed to create user')
        }
    }

    static async findByCpf(cpf){
        const query = `SELECT * FROM employee where cpf = $1`
        const result = await pool.query(query,[cpf])
        return result.rows[0] || null
    }

}

module.exports = EmployeeModel