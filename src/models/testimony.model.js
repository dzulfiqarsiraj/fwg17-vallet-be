const db = require("../lib/db.lib")


// SELECT *
exports.allTestimony = async(filter='', sortby, order, page, limits) => {
    const visibleColumn = ["id, rating", "review"]
    const allowOrder = ['asc', 'desc']

    const offset = (page - 1) * limits

    sortby = visibleColumn.includes(sortby) ? sortby : "id"
    order = allowOrder.includes(order) ? order : 'asc'

    const sql = `
    SELECT * 
    FROM "testimony"
    WHERE "review" ILIKE $1
    ORDER BY "${sortby}" ${order}
    LIMIT ${limits}
    OFFSET ${offset}
    `
    const values = [`%${filter}%`]
    const {rows} = await db.query(sql, values)
    return rows
}


// COUNT DATA
exports.countData = async(search='') => {
    const sql = `
    SELECT COUNT("id") AS "counts"
    FROM "testimony"
    WHERE "review" ILIKE $1
    `
    const values = [`%${search}%`]
    const { rows } = await db.query(sql, values)
    return rows[0].counts // RETURN TOTAL DATA
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