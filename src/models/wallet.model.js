const db = require("../lib/db.lib")

exports.findAll= async () => {
  const sql =
  `SELECT * 
  FROM "wallet"
  `
  const values = []
  const {rows} = await db.query(sql, values)
  return rows
}

exports.findOneById = async(id) => {
  const sql = `
  SELECT * 
  FROM "wallet"
  WHERE "id" = $1 
  `
  const values = [id]
  const {rows} = await db.query(sql, values)
  return rows[0]
}

exports.findOneByUserId = async(id) => {
  const sql = `
  SELECT "balance", "id"
  FROM "wallet"
  WHERE "userId" = $1 
  `
  const values = [id]
  const {rows} = await db.query(sql, values)
  return rows[0]
}

exports.insert = async (data) => {
  
  const sql = 
  `
  INSERT INTO "wallet"
  ("userId","balance")
  VALUES
  ($1, $2)
  RETURNING *
  `
  const values = [data.userId, data.balance]
  const {rows} = await db.query(sql, values)
  return rows[0]
}

exports.update = async (id, data) => {
  const column = []
  const values = []

  values.push(id)
  for(let item in data){
    values.push(data[item])
    column.push(`"${item}"=$${values.length}`)
  }

  const sql = 
  `
  UPDATE "wallet"
  SET ${column.join(', ')}, "updatedAt" = now()
  WHERE "id"=$1
  RETURNING *
  `

  const {rows} = await db.query(sql, values)
  return rows[0]
}


exports.updateByUserId = async (id, data) => {
  const values = [id, data]

  const sql = 
  `
  UPDATE "wallet"
  SET "balance" = $2, "updatedAt" = now()
  WHERE "userId"=$1
  RETURNING *
  `

  const {rows} = await db.query(sql, values)
  return rows[0]
}

exports.delete = async (id) => {
  const sql = 
  `
  DELETE FROM "wallet"
  WHERE "id" = $1
  RETURNING *
  `
  const values = [id]
  const {rows} = await db.query(sql, values)
  return rows[0]
}