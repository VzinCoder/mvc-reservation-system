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
            throw new Error(`Failed to create user : ${result.command}`)
        }
        return true
    }

    static async findByCpf(cpf){
        const query = `SELECT * FROM employee where cpf = $1`
        const result = await pool.query(query,[cpf])
        return result.rows[0] || null
    }

    static async deleteById(id){
        const query = `DELETE FROM employee WHERE id = $1`
        const result = await pool.query(query,[id])
        if(result.rowCount === 0){
            throw new Error(`Failed to delete employee : ${result.command}`)
        }
        return true
    }

    static async findById(id){
        const query = `SELECT * FROM employee where id = $1`
        const result = await pool.query(query,[id])
        return result.rows[0] || null
    }

    static async updateEmployee({id,salary,cpf,password,name}){
        const query = `UPDATE employee SET name = $1,cpf = $2,salary = $3, password = $4 where id = $5`
        const result = await pool.query(query,[name,cpf,salary,password,id])
        if(result.rowCount === 0){
            throw new Error(`Failed to update employee : ${result.command}`)
        }
        return true
    }

    static async existsById(id){
        const query = "Select * from employee where id = $1"
        const result = await pool.query(query,[id])
        return Boolean(result.rows[0])
    }

}

module.exports = EmployeeModel