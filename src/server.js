require('dotenv').config()
const express = require('express')
const server = express()
const path = require('path')
const routerEmployee = require('./routes/employee')

server.set('views','src/views')
server.set('view engine','ejs')

const PORT = 3000 

const DIR_PUBLIC_FILES = path.join(__dirname,'public')

server.use('/public',express.static(DIR_PUBLIC_FILES))
server.use('/employee',routerEmployee)

server.get('/',(req,res)=> {
    res.render('index.ejs')
})

server.listen(PORT,()=> {
    console.log(`Server on Port:${PORT}`)
})