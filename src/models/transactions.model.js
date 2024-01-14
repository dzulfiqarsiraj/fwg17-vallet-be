const db = require("../lib/db.lib")

exports.allTransactions = async() => {
    const sql = `SELECT * FROM "transactions"`
    const values = []
    const {rows} = await db.query(sql, values)
    return rows
}