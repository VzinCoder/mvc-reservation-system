require('dotenv').config()
require('./util/envValidator').validateEnvVars()

const session = require('express-session')
const flash = require('connect-flash')
const express = require('express')
const cors = require('cors')
const server = express()
const path = require('path')
const routerEmployee = require('./routes/employee')
const routerCustomer = require('./routes/customer')
const routerRoom = require('./routes/room')
const routerAuth = require('./routes/auth')
const routerReserve = require('./routes/reserve')
const { initDb, pool } = require('./db/conn')
const logger = require('./util/logger')
const DashboardController = require('./controller/DashboardController')

const PORT = 3000
const DIR_PUBLIC_FILES = path.join(__dirname, 'public')

const configSession = {
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true,
    }
}

server.set('views', 'src/views')
server.set('view engine', 'ejs')

server.use(cors())
server.use(session(configSession))
server.use(flash())

server.use((req, res, next) => {
    res.locals.sucessMessages = req.flash('sucess')
    res.locals.errorMessages = req.flash('error')
    next()
})

server.use(express.urlencoded({ extended: true }))
server.use('/public', express.static(DIR_PUBLIC_FILES))

server.use(async (req, res, next) => {
    try {
        if (!req.session.user) {
            const query = `SELECT * FROM employee where type = 'admin' limit 1`
            const { rows } = await pool.query(query)
            if (rows.length <= 0) {
                throw new Error('Admin not afound!')
            }
            logger.info('add admin to session')
            req.session.user = rows[0]
        }
        next()
    } catch (error) {
        logger.error('Error add admin in session', error)
        next(error)
    }
})

server.use('/employee', routerEmployee)
server.use('/customer', routerCustomer)
server.use('/room', routerRoom)
server.use('/auth', routerAuth)
server.use('/reserve', routerReserve)

server.get('/', (req, res, next) => {
    DashboardController.getPageHome(req, res, next)
})

server.use((req, res, next) => {
    res.render('404')
})

server.use((err, req, res, next) => {
    const viewPath = '500'
    const viewModel = {
        env: process.env.NODE_ENV,
        errorMessages: [err.message]
    }
    res.render(viewPath, viewModel)
})

initDb().then(() => {
    server.listen(PORT, () => {
        logger.info(`Server on Port:${PORT}`)
    })
})