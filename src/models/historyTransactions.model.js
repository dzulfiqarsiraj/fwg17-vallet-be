const db = require('../lib/db.lib')

// CUSTOMER
exports.allHistoryTransactions = async(id, filter, page, limits) => {
    const offset = (page - 1) * limits

    const sql = `
    SELECT
    "t"."id", "t"."amount",
    jsonb_build_object(
    'id', "u1"."id",
    'fullName', "u1"."fullName",
    'picture',"u1"."picture",
    'phone', "u1"."phoneNumber"
    ) AS "sender",
    jsonb_build_object(
    'id', "u2"."id",
    'fullName', "u2"."fullName",
    'picture',"u2"."picture",
    'phone', "u2"."phoneNumber"
    ) AS "recipient",
    "t"."createdAt", "t"."updatedAt"
    FROM "transfer" "t"
    INNER JOIN "users" "u1" ON "u1"."id" = "t"."senderId"
    INNER JOIN "users" "u2" ON "u2"."id" = "t"."recipientId"
    WHERE ("t"."senderId"=$1 OR "t"."recipientId"=$1) AND (("u1"."fullName" ILIKE $2 OR "u2"."fullName" ILIKE $2) OR ("u1"."phoneNumber" ILIKE $2 OR "u2"."phoneNumber" ILIKE $2))
    ORDER BY "t"."id" DESC
    LIMIT ${limits}
    OFFSET ${offset}
    `;
    const values = [id, `%${filter}%`]
    const {rows} = await db.query(sql,values)
    return rows
}

// COUNT DATA
exports.countData = async(id, filter) => {
    const sql = `
    SELECT COUNT(*) AS "counts"
    FROM "transfer" "t"
    INNER JOIN "users" "u1" ON "u1"."id" = "t"."senderId"
    INNER JOIN "users" "u2" ON "u2"."id" = "t"."recipientId"
    WHERE ("t"."senderId"=$1 OR "t"."recipientId"=$1) AND (("u1"."fullName" ILIKE $2 OR "u2"."fullName" ILIKE $2) OR ("u1"."phoneNumber" ILIKE $2 OR "u2"."phoneNumber" ILIKE $2))
    `
    const values = [id, `%${filter}%`]
    const { rows } = await db.query(sql, values)
    return rows[0].counts
}