const express = require('express')
const server = express()


const PORT = 3000 


server.get('/',(req,res)=> {
    res.status(200).json({msg:"hello world"})
})

server.listen(PORT,()=> {
    console.log(`Server on Port:${PORT}`)
})