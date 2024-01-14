const db = require("../lib/db.lib")

exports.allTransactionTypes = async() => {
    const sql = `SELECT * FROM "transactionTypes"`
    const values = []
    const {rows} = await db.query(sql, values)
    return rows
}