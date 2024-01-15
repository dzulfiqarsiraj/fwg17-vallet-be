const usersModel = require('../../models/users.model')
const argon = require('argon2')

exports.getAll = async (req, res) => {
  const {
    search,
    sortBy,
    order
  } = req.query

  let {page} = req.query

  if(!page){
    page = 1
  }

  try {
    const count = await usersModel.countAll(search)
    const users = await usersModel.findAll(search, sortBy, order, page)

    const totalPage = Math.ceil(count / 10)
    const nextPage = Number(page) + 1
    const prevPage = Number(page) - 1

    return res.json({
      success: true,
      message: 'List All users',
      pageInfo: {
        currentPage: Number(page),
        totalPage,
        nextPage: nextPage < totalPage ? nextPage : null,
        prevPage: prevPage < 1 ? null : prevPage,
        totalData: Number(count)
      },
      results: users
    })
  }catch(err){
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

exports.detail = async (req, res) => {
  const id = Number(req.params.id)
  const users = await usersModel.findOne(id)

  if(!users){
    return res.status(404).json({
      success: false,
      message: `users not found`,
    })
  }

  return res.json({
    success: true,
    message: `Detail users`,
    results: users
  })
}

exports.create = async (req,res) => {
  try {
    if(req.body.password){
      req.body.password = await argon.hash(req.body.password)
    }

    if(req.file){
      req.body.picture = req.file.filename
    }

    const col = []
    const values = []
  
    function testnumber(str){
      return /^[0-9]/.test(str)
    }
  
    for(let i in req.body){
      if(testnumber(i) === false){
        values.push(req.body[i])
      }else {
        values.push(Number(req.body[i]))
      }
      
      col.push(`"${i}"`)
    }

    const users = await usersModel.insert(col, values)
    return res.json({
      success: true,
      message: 'Create users successfully',
      results: users
    })
  }catch(err){
    switch(err.code){
      case "23505":
      return res.status(411).json({
        success: false,
        message: 'name is unique'
      })
      break;
      case '23502':
      return res.status(411).json({
        success: false,
        message: 'name cannot be null'
      })
      break;
      default: 
      return res.status(500).json({
        success: false,
        message: err.message
      })
    }
  }
}


exports.update = async (req,res) => {
  const {id} = req.params
  try {
    const col = []
    const values = [] 
    // values.push(Number(id))
  
    function testnumber(str){
      return /^[0-9]/.test(str)
    }
  
    for(let i in req.body){
      if(testnumber([i]) === false){
        values.push(req.body[i])
      }else {
        values.push(Number(req.body[i]))
      }
      
      col.push(`"${i}"=$${values.length+1}`)
    }

    const users = await usersModel.update(id, col, values)
    if(users){
      return res.json({
        success: true,
        message: 'Update users successfully',
        results: users
      })
    }else{
      return res.status(404).json({
        success: false,
        message: 'users not found'
      })
    }
  }catch(err){
    switch(err.code){
      case "23505":
      return res.status(411).json({
        success: false,
        message: 'name is unique'
      })
      break;
      default: 
      return res.status(500).json({
        success: false,
        message: err.message
      })
    }
  }
}

exports.delete = async(req,res) => {
  const id = Number(req.params.id)
  const users = await usersModel.delete(id)
  try {
    if(users){
      return res.json({
        success: true,
        message: `successfully delete users`,
        results: users
      })
    }else{
      return res.status(404).json({
        success: false,
        message: `users not found`
      })
    }
  }catch(err){
    return res.status(500).json({
      success: false,
      message: `Internal server error`
    })
  }
}