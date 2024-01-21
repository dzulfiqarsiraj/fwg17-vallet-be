const db = require("../lib/db.lib")

exports.insert = async(data) => {
    const sql = `
    INSERT INTO "forgotPassword" ("otp", "email", "userId") VALUES ($1, $2, $3)
    RETURNING *
    `
    const values = [data.otp, data.email, data.userId]
    const {rows} = await db.query(sql, values)
    return rows[0]
}


exports.findOnebyOtp = async (otp) => {
    const sql = `
    SELECT * FROM "forgotPassword" WHERE "otp" = $1
    `
    const values = [otp]
    const {rows} = await db.query(sql, values)
    return rows[0]
}



exports.delete = async (id) => {
    const sql = `
    DELETE FROM "forgotPassword" WHERE id = $1
    RETURNING *
    `
    const values = [id]
    const {rows} = await db.query(sql, values)
    return rows[0]
}