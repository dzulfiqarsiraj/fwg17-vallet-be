require('dotenv').config({
    patch: './.env'
})

// untuk mengetahui lokasi file nya
global.path = __dirname

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(express.urlencoded({extended: false}))
app.use(morgan("dev")) // untuk login akses
app.use(cors()) // untuk memperbolehkan frontend mengakses BackEnd kita, jika tidak di berikan cors nanti tidak bisa aplikasi frontend kita mengakses back end nya.

app.use('/uploads/paymentMethods', express.static('uploads/paymentMethods'))
app.use('/uploads/profiles', express.static('uploads/profiles'))

// Cek apakah link utama berjalan
app.get('/', (req, res) => {
    // console.log(req.body)
    return res.json({
        success: true,
        message: "Backend is running well!"
    })
})

app.use('/', require('./src/routers/index'))

// Respons bila link yg input tidak ada
app.use('/', (req, res)=>{
    res.status(404)
    res.send('<h1>404</h1>')
})


app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});
