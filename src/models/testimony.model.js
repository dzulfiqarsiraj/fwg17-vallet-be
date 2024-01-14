const db = require("../lib/db.lib")

exports.allTestimony = async() => {
    const sql = `SELECT * FROM "testimony"`
    const values = []
    const {rows} = await db.query(sql, values)
    return rows
}