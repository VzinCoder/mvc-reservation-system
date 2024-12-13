

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

}

module.exports = CustomerModel