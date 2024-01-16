const db = require("../lib/db.lib")

exports.findAll = async() => {
  const sql = 
  `
  SELECT *
  FROM "transfer"
  `
  const values = []
  const {rows} = await db.query(sql, values)
  return rows
}

exports.findOneById = async (id) => {
  const sql = 
  `
  SELECT *
  FROM "transfer"
  WHERE "id" = $1
  `
  const values = [id]
  const {rows} = await db.query(sql, values)
  return rows[0]
}

exports.insert = async (data) => {
  const sql = 
  `
  INSERT INTO "transfer"
  ("amount","senderId","recipientId","note")
  VALUES
  ($1,$2,$3,$4)
  RETURNING *
  `

  const values = [data.amount, data.senderId, data.recipientId, data.note]
  const {rows} = await db.query(sql, values)
  return rows[0]
}

exports.update = async (id, data) => {
  const column = []
  const values = []

  values.push(Number(id))
  for(let item in data){
    values.push(data[item])
    column.push(`"${item}"=$${values.length}`)
  }

  const sql =
  `
  UPDATE "transfer"
  SET ${column.join(', ')}, "updatedAt" = now()
  WHERE "id" = $1
  RETURNING *
  `

  const {rows} = await db.query(sql, values)
  return rows[0]
}

exports.delete = async (id) => {
  const sql = 
  `
  DELETE FROM "transfer"
  WHERE "id" = $1
  RETURNING *
  `
  const values = [id]
  const {rows} = await db.query(sql, values)
  return rows[0]
}