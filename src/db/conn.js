const pg = require('pg')
const { Pool } = pg

const pool = new Pool({
    connectionString:process.env.DATABASE_URL
})

const initDb = async () => {
    await pool.connect()
}

module.exports = {
    pool,
    initDb
}