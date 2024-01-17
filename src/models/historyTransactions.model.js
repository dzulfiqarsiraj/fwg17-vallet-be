const db = require('../lib/db.lib')

// CUSTOMER
exports.allHistoryTransactions = async(id) => {
    const sql = `
    SELECT
    "t"."id", "t"."amount",
    jsonb_build_object(
    'id', "u1"."id",
    'fullName', "u1"."fullName",
    'phone', "u1"."phoneNumber"
    ) AS "sender",
    jsonb_build_object(
    'id', "u2"."id",
    'fullName', "u2"."fullName",
    'phone', "u2"."phoneNumber"
    ) AS "recipient",
    "t"."createdAt", "t"."updatedAt"
    FROM "transfer" "t"
    INNER JOIN "users" "u1" ON "u1"."id" = "t"."senderId"
    INNER JOIN "users" "u2" ON "u2"."id" = "t"."recipientId"
    WHERE "t"."senderId"=$1 OR "t"."recipientId"=$1
    `
    const values = [id]
    const {rows} = await db.query(sql,values)
    return rows
}