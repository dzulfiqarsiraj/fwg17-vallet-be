const db = require("../lib/db.lib")


// SELECT
exports.allTransactions = async(sortby, order, page, limits) => {
    const visibleColumn = [
        "id", 
        "transactionTypeId", 
        "walletId", 
        "paymentMethodId"
    ]
    const allowOrder = ['asc', 'desc']

    const offset = (page - 1) * limits

    sortby = visibleColumn.includes(sortby) ? sortby : "id"
    order = allowOrder.includes(order) ? order : 'asc'

    const sql = `SELECT * 
    FROM "transactions"
    ORDER BY "${sortby}" ${order}
    LIMIT ${limits}
    OFFSET ${offset}
    `
    const values = []
    const {rows} = await db.query(sql, values)
    return rows
}


// COUNT DATA
exports.countData = async() => {
    const sql = `
    SELECT COUNT("id") AS "counts"
    FROM "transactions"
    `
    const values = []
    const { rows } = await db.query(sql, values)
    return rows[0].counts // RETURN TOTAL DATA
}


// SELECT * BY id
exports.idTransaction = async(id) => {
    const sql = `SELECT * FROM "transactions" WHERE "id"=$1`
    const values = [id]
    const {rows} = await db.query(sql, values)
    return rows[0]
}


// CREATE DATA
exports.createTransactions = async(walletId, data) => {
    const sql = `
    INSERT INTO "transactions" 
    ("transactionTypeId", "walletId", "paymentMethodId", "amount", "tax") 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *`
    const values = [
        data.transactionTypeId, 
        walletId, 
        data.paymentMethodId, 
        data.amount, 
        data.tax
    ]
    const {rows} = await db.query(sql, values)
    return rows[0]
}


// UPDATE DATA
exports.updateTransactions = async(id, data) => {
    const sql = `
    UPDATE "transactions" 
    SET 
    "transactionTypeId"= $2, 
    "walletId"=$3, 
    "paymentMethodId"=$4, 
    "amount"=$5, 
    "tax"=$6, 
    "updatedAt"=now()
    WHERE "id"= $1
    RETURNING *`
    const values = [
        id, 
        data.transactionTypeId, 
        data.walletId, 
        data.paymentMethodId,
        data.amount,
        data.tax
    ]
    const {rows} = await db.query(sql, values)
    return rows[0]
}


// DELETE DATA
exports.deleteTransactions = async(id) => {
    const sql = `DELETE FROM "transactions" WHERE "id"= $1 RETURNING *`
    const values = [id]
    const {rows} = await db.query(sql, values)
    return rows[0]
}