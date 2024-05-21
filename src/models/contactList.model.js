const db = require('../lib/db.lib')

exports.findAll = async (sortBy='id', order, page=1)=>{
  const visibleColumn = ['id','createdAt', 'name']
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
  FROM "contactList"
  LIMIT ${limit} OFFSET ${offset}
  `
  const {rows} = await db.query(sql)
  return rows
}

exports.findOne = async (id)=>{
  console.log(id)
  const sql = `SELECT *
  FROM "users" WHERE "id" = $1`
  const values = [id]
  const {rows} = await db.query(sql,values)
  if(!rows.length){
    throw ("user not found")
  }
  return rows[0]
}

exports.insert = async (colName, colValues)=>{
  const col = []
  const values = []
  const dollar = []

  for(let i = 0; i < colName.length; i++){
    col.push(colName[i])
    values.push(colValues[i])
    
    dollar.push(`$${values.length}`)
  }

  const sql = `INSERT INTO "contactList" (${col.join(', ')}) VALUES (${dollar.join(', ')}) RETURNING *`
  const {rows} = await db.query(sql,values)
  return rows[0]
}


exports.update = async (id, colName, colValues)=>{
  const col = []
  const values = [] 
  values.push(id)

  for(let i = 0; i < colName.length; i++){
    col.push(colName[i])
    values.push(colValues[i])
    
    // dollar.push(`$${values.length}`)
  }

  const sql = `UPDATE "contactList" SET ${col.join(', ')}, "updatedAt" = now() WHERE "id" = $1 
  RETURNING *`
  const {rows} = await db.query(sql,values)
  return rows[0] 
}

exports.delete = async (id)=>{
  const sql = `DELETE FROM "contactList" WHERE "id" = $1 RETURNING *`
  const values = [id]
  const {rows} = await db.query(sql,values)
  return rows[0]
}

exports.countAll = async ()=>{
  const sql = `SELECT count(id) AS counts 
  FROM "contactList"
  `
  const {rows} = await db.query(sql)
  console.log(rows)
  return rows[0].counts
}


// CUSTOMER
exports.allContactListforCustomer = async(id, search, limit, offset, page) => {
  const sql = `
  SELECT "u"."id" as "userId", "u"."picture", "u"."fullName", "u"."phoneNumber", "cl"."isFavorite" 
  FROM "contactList" "cl"
  INNER JOIN "users" "u" ON "u"."id" = "cl"."contactId"
  WHERE "userId"=$1 AND "u"."fullName" ILIKE $2
  `
  const values = [id, `%${search}%`]
  const {rows} = await db.query(sql,values)
  return rows
}



exports.findByPhoneNumber = async (phoneNumber, limit, offset)=>{
  const sql = `
  select "id" as "userId", "fullName", "phoneNumber", "picture"
  from "users"
  where "phoneNumber" LIKE $1
  limit ${limit} offset ${offset}
  `
  const values = ["%"+phoneNumber+"%"]
  const {rows} = await db.query(sql,values)
  if(!rows.length){
    throw new Error("no data found")
  }
  return rows
}


exports.countAllByPhoneNumber = async (phoneNumber)=>{
  const sql = `SELECT count(id) AS count
  FROM "users"
  WHERE "phoneNumber" LIKE $1
  `
  const values = [`%${phoneNumber}%`]
  const {rows} = await db.query(sql,values)
  console.log(rows)
  return rows[0].count
}

exports.findOneTransferDetail = async (id)=>{
  const sql = `SELECT "fullName", "phoneNumber", "isVerified", "id", "picture"
  FROM "users" WHERE "id" = $1`
  const values = [id]
  const {rows} = await db.query(sql,values)
  return rows[0]
}