const db = require("../lib/db.lib")

exports.allTransfer = async() => {
    const sql = `SELECT * FROM "transfer"`
    const values = []
    const {rows} = await db.query(sql, values)
    return rows
}