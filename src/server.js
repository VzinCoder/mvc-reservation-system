require('dotenv').config()
const express = require('express')
const server = express()

server.set('views','src/views')
server.set('view engine','ejs')

const PORT = 3000 


server.get('/',(req,res)=> {
    res.render('index.ejs')
})

server.listen(PORT,()=> {
    console.log(`Server on Port:${PORT}`)
})