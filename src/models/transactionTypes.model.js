const db = require("../lib/db.lib")


// SELECT *
exports.allTransactionTypes = async() => {
    const sql = `SELECT * FROM "transactionTypes"`
    const values = []
    const {rows} = await db.query(sql, values)
    return rows
}


// SELECT * BY id
exports.idTransactionTypes = async(id) => {
    const sql = `SELECT * FROM "transactionTypes" WHERE "id"=$1`
    const values = [id]
    const {rows} = await db.query(sql, values)
    return rows[0]
}


// CHECK DATA JIKA SUDA ADA
exports.checkData = async(name) => {
    const sql = `SELECT * FROM "transactionTypes" WHERE "name"=$1`
    const values = [name]
    const {rows} = await db.query(sql, values)
    return rows[0]
}


// CREATE DATA
exports.createTransactionTypes = async(name) => {
    const sql = `INSERT INTO "transactionTypes" ("name") VALUES ($1) RETURNING *`
    const values = [name]
    const {rows} = await db.query(sql, values)
    return rows
}


// CREATE DATA
exports.updateTransactionTypes = async(id, name) => {
    const sql = `
    UPDATE "transactionTypes" 
    SET "name"= $2, "updatedAt"=now()
    WHERE "id"= $1
    RETURNING *`
    const values = [id, name]
    const {rows} = await db.query(sql, values)
    return rows
}


// DELETE DATA
exports.deleteTransactionTypes = async(id) => {
    const sql = `DELETE FROM "transactionTypes" WHERE "id"= $1 RETURNING *`
    const values = [id]
    const {rows} = await db.query(sql, values)
    return rows
}