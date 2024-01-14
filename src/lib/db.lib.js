const {Pool} = require('pg')

const db = new Pool ({
    connectionString: process.env.DATABASE_URL
})

db.connect((err) => {
    if(!err){
        console.log('Connection Success')
    }
})

module.exports = db