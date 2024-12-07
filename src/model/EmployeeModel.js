const { pool } = require('../db/conn')

class EmployeeModel {

    static async findAll() {
        return pool.query(`SELECT * FROM employee`)
    }

}