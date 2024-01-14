require('dotenv').config({
    patch: './.env'
})

const express = require('express')

const app = express()

// Respons bila link yg input tidak ada
app.use('/', (reg, res)=>{
    res.status(404)
    res.send('<h1>404</h1>')
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})