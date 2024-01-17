const db = require('../lib/db.lib')

exports.findAll = async () => {
	const sql = 
	`
	SELECT *
	FROM "paymentMethod";
	`
	const values = []
	const {rows} = await db.query(sql, values)
	return rows
}

exports.findOneById = async (id) => {
	const sql = 
	`
	SELECT *
	FROM "paymentMethod"
	WHERE "id"=$1
	`

	const values = [id]
	const {rows} = await db.query(sql, values)
	return rows[0]
}

exports.insert = async (data) => {
	const sql = 
	`
	INSERT INTO "paymentMethod"
	("name","image")
	VALUES
	($1,$2)
	RETURNING *
	`
	const values = [data.name, data.image]
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
	UPDATE "paymentMethod"
	SET ${column.join(', ')}, "updatedAt" = now()
	WHERE "id"=$1
	RETURNING *
	`
	const {rows} = await db.query(sql, values)
	return rows[0]
}

exports.updateImageForCreate = async (id, data) => {
	const column = []
	const values = []

	values.push(id)
	for(let item in data){
		values.push(data[item])
		column.push(`"${item}"=$${values.length}`)
	}
	const sql = 
	`
	UPDATE "paymentMethod"
	SET ${column.join(', ')}
	WHERE "id"=$1
	RETURNING *
	`
	const {rows} = await db.query(sql, values)
	return rows[0]
}

exports.delete = async (id) => {
	const sql = 
	`
	DELETE FROM "paymentMethod"
	WHERE "id" = $1
	RETURNING *
	`
	const values = [id]
	const {rows} = await db.query(sql, values)
	return rows[0]
}