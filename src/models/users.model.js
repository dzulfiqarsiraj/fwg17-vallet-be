const db = require("../lib/db.lib")

exports.allUsers = async() => {
    const sql = `SELECT * FROM "users"`
    const values = []
    const {rows} = await db.query(sql, values)
    return rows
}