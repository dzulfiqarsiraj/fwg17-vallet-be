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

exports.findOneProfile = async (id)=>{
  const sql = `SELECT "fullName", "phoneNumber", "email", "isVerified", "id", "picture"
  FROM "users" WHERE "id" = $1`
  const values = [id]
  const {rows} = await db.query(sql,values)
  return rows[0]
}

exports.findPassword = async (id)=>{
  const sql = `SELECT "password"
  FROM "users" WHERE "id" = $1`
  const values = [id]
  const {rows} = await db.query(sql,values)
  return rows[0]
}

exports.findOneByEmail = async (email)=>{
  const sql = `select "users"."id" as "userId", "email", "password", "roleId", "name" as "roleName"
  from "users"
  join "roles" "r" on "users"."roleId" = "r"."id"
  where "email" = $1`
  const values = [email]
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

  const sql = `INSERT INTO "users" (${col.join(', ')}) VALUES (${dollar.join(', ')}) RETURNING *`
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

    // dollar.push($${values.length})
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


exports.updateProfile = async (id, data) => {
    const column = []
    const values = []
    values.push(id)
    for(let item in data){
        if(data[item] || item == 'picture') {
            values.push(data[item])
            column.push(`"${item}"=$${values.length}`)
        }
    }

    const sql = `
    UPDATE "users"
    SET ${column.join(", ")}, "updatedAt"=now()
    WHERE "id"= $1
    RETURNING *
    `
    const {rows} = await db.query(sql, values)
    return rows[0]
}