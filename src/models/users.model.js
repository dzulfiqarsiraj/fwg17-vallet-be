const db = require('../lib/db.lib')

exports.findAll = async (keyword='', sortBy='id', order, page=1)=>{
  const visibleColumn = ['id','createdAt', 'fullName']
  const allowOrder = ['asc', 'desc']
  const limit = 10
  const offset = (page - 1) * limit
  let sort
  
  order = allowOrder.includes(order) ? order : 'asc'

  if(typeof sortBy === 'string'){
    sort = visibleColumn.includes(sortBy) ? sortBy : 'id'
    sort = `"${sort}"`
  }else{
    sort = visibleColumn.filter(value => sortBy.includes(value))
    sort = sort.join('","')
    sort = `"${sort}"`
  }

  const sql = `SELECT *
  FROM "users" WHERE "fullName" ILIKE $1
  ORDER BY ${sort} ${order}
  LIMIT ${limit} OFFSET ${offset}
  `
  const values = [`%${keyword}%`]
  const {rows} = await db.query(sql,values)
  return rows
}

exports.findOne = async (id)=>{
  const sql = `SELECT *
  FROM "users" WHERE "id" = $1`
  const values = [id]
  const {rows} = await db.query(sql,values)
  return rows[0]
}

exports.findOneByEmail = async (email)=>{
  const sql = `SELECT *
  FROM "users" WHERE "email" = $1`
  const values = [email]
  const {rows} = await db.query(sql,values)
  return rows[0]
}

exports.insert = async (data1, data2)=>{
  const col = []
  const values = []
  const dollar = []

  for(let i = 0; i < data1.length; i++){
    col.push(data1[i])
    values.push(data2[i])
    
    dollar.push(`$${values.length}`)
  }

  const sql = `INSERT INTO "users" (${col.join(', ')}) VALUES (${dollar.join(', ')}) RETURNING *`
  const {rows} = await db.query(sql,values)
  return rows[0]
}


exports.update = async (id, data1, data2)=>{
  const col = []
  const values = [] 
  values.push(id)

  for(let i = 0; i < data1.length; i++){
    col.push(data1[i])
    values.push(data2[i])
    
    // dollar.push(`$${values.length}`)
  }

  const sql = `UPDATE "users" SET ${col.join(', ')}, "updatedAt" = now() WHERE "id" = $1 
  RETURNING *`
  const {rows} = await db.query(sql,values)
  return rows[0] 
}

exports.delete = async (id)=>{
  const sql = `DELETE FROM "users" WHERE "id" = $1 RETURNING *`
  const values = [id]
  const {rows} = await db.query(sql,values)
  return rows[0]
}

exports.countAll = async (keyword='')=>{
  const sql = `SELECT count(id) AS counts 
  FROM "users"
  WHERE "fullName" ILIKE $1
  `
  const values = [`%${keyword}%`]
  const {rows} = await db.query(sql,values)
  return rows[0].counts
}