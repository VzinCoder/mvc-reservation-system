require('dotenv').config()

const session = require('express-session')
const flash = require('connect-flash')
const express = require('express')
const cors = require('cors')
const server = express()
const path = require('path')
const routerEmployee = require('./routes/employee')
const { initDb } = require('./db/conn')


const PORT = 3000
const DIR_PUBLIC_FILES = path.join(__dirname, 'public')

const configSession = {
    secret:process.env.COOKIE_KEY,
    resave:false,
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

server.use((req,res,next) => {
    res.locals.sucessMessages = req.flash('sucess')
    res.locals.errorMessages = req.flash('error')
    next()
})

server.use(express.urlencoded({ extended: true }))
server.use('/public', express.static(DIR_PUBLIC_FILES))
server.use('/employee', routerEmployee)

server.get('/', (req, res) => {
    res.render('index.ejs')
})


initDb().then(() => {
    server.listen(PORT, () => {
        console.log(`Server on Port:${PORT}`)
    })
})