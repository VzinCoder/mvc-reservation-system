const pg = require('pg')
const { Pool } = pg
const { v4: uuidv4 } = require('uuid')
const logger = require('../util/logger')
const bcrypt = require('bcrypt')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})


const isExistsAdmin = async () => {
    const query = `SELECT COUNT(*) AS count FROM employee WHERE type = 'admin'`
    const { rows } = await pool.query(query);
    return parseInt(rows[0].count, 10) > 0
}

const createAdmin = async () => {

    if (await isExistsAdmin()) {
        logger.info('Admin already exists')
        return
    }

    const query = `INSERT INTO employee (id,type,name,password,cpf,salary) 
                   values ($1,$2,$3,$4,$5,$6)
    `
    const id = uuidv4()
    const type = 'admin'
    const name = process.env.ADMIN_NAME
    const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    const cpf = process.env.ADMIN_CPF
    const salary = 9999

    const values = [id, type, name, hashPassword, cpf, salary]
    const { rowCount } = await pool.query(query, values)
    if (rowCount === 0) {
        throw Error('Error create admin')
    }
    logger.info('Admin successfully created')
}

const initDb = async () => {
    await pool.connect()
    await createAdmin()
}

module.exports = {
    pool,
    initDb
}