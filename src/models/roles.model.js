const db = require("../lib/db.lib")

exports.allRoles = async() => {
    const sql = `SELECT * FROM "roles"`
    const values = []
    const {rows} = await db.query(sql, values)
    return rows
}