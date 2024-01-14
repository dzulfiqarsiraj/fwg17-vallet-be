const db = require("../lib/db.lib")

exports.allContactList = async() => {
    const sql = `SELECT * FROM "contactList"`
    const values = []
    const {rows} = await db.query(sql, values)
    return rows
}