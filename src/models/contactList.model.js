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
  const values = []
  const {rows} = await db.query(sql,values)
  return rows
}

exports.findOne = async (id)=>{
  const sql = `SELECT *
  FROM "contactList" WHERE "id" = $1`
  const values = [id]
  const {rows} = await db.query(sql,values)
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
  const values = []
  const {rows} = await db.query(sql,values)
  return rows[0].counts
}


// CUSTOMER
exports.allContactListforCustomer = async(id) => {
  const sql = `
  SELECT "u"."picture", "u"."fullName", "u"."phoneNumber", "cl"."isFavorite" 
  FROM "contactList" "cl"
  INNER JOIN "users" "u" ON "u"."id" = "cl"."contactId"
  WHERE "userId"=$1
  `
  const values = [id]
  const {rows} = await db.query(sql,values)
  return rows
}