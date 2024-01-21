const db = require("../lib/db.lib")

exports.insert = async(data) => {
    const sql = `
    INSERT INTO "forgotPin" ("otp", "email", "userId") VALUES ($1, $2, $3)
    RETURNING *
    `
    const values = [data.otp, data.email, data.userId]
    const {rows} = await db.query(sql, values)
    return rows[0]
}


exports.findOnebyOtp = async (otp) => {
    const sql = `
    SELECT * FROM "forgotPin" WHERE "otp" = $1
    `
    const values = [otp]
    const {rows} = await db.query(sql, values)
    return rows[0]
}



exports.delete = async (id) => {
    const sql = `
    DELETE FROM "forgotPin" WHERE id = $1
    RETURNING *
    `
    const values = [id]
    const {rows} = await db.query(sql, values)
    return rows[0]
}