const db = require("../lib/db.lib")


exports.allTestimony = async() => {
    const sql = `SELECT * FROM "testimony"`
    const values = []
    const {rows} = await db.query(sql, values)
    return rows
}


// SELECT * BY id
exports.idTestimony = async(id) => {
    const sql = `SELECT * FROM "testimony" WHERE "id"=$1`
    const values = [id]
    const {rows} = await db.query(sql, values)
    return rows[0]
}


// CREATE DATA
exports.createTestimony = async(idUser, data) => {
    const sql = `
    INSERT INTO "testimony" 
    ("userId", "rating", "review") 
    VALUES ($1, $2, $3) 
    RETURNING *`
    const values = [idUser, data.rating, data.review]
    const {rows} = await db.query(sql, values)
    return rows[0]
}


// UPDATE DATA
exports.updateTestimony = async(id, rating, review) => {
    const sql = `
    UPDATE "testimony" 
    SET "rating"= $2, "review"=$3, "updatedAt"=now()
    WHERE "id"= $1
    RETURNING *`
    const values = [id, rating, review]
    const {rows} = await db.query(sql, values)
    return rows[0]
}


// DELETE DATA
exports.deleteTestimony = async(id) => {
    const sql = `DELETE FROM "testimony" WHERE "id"= $1 RETURNING *`
    const values = [id]
    const {rows} = await db.query(sql, values)
    return rows[0]
}