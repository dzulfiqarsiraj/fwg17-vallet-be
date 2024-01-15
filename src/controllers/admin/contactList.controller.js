const contactListModel = require('../../models/contactList.model')

const handleErr = require('../../helpers/utils')

exports.getAll = async (req, res) => {
  const {
    // search,
    sortBy,
    order
  } = req.query

  let {page} = req.query

  if(!page){
    page = 1
  }

  try {
    const count = await contactListModel.countAll()
    const contactList = await contactListModel.findAll(sortBy, order, page)

    // console.log(contactList.results)

    if(contactList){
      throw ({code: 'THROW', message: 'data not found'})
    }

    const totalPage = Math.ceil(count / 10)
    const nextPage = Number(page) + 1
    const prevPage = Number(page) - 1

    return res.json({
      success: true,
      message: 'List All contactList',
      pageInfo: {
        currentPage: Number(page),
        totalPage,
        nextPage: nextPage < totalPage ? nextPage : null,
        prevPage: prevPage < 1 ? null : prevPage,
        totalData: Number(count)
      },
      results: contactList
    })
  }catch(err){
    handleErr.outError(err, res)
  }
}

exports.detail = async (req, res) => {
  const id = Number(req.params.id)
  const contactList = await contactListModel.findOne(id)

  if(!contactList){
    return res.status(404).json({
      success: false,
      message: `contactList not found`,
    })
  }

  return res.json({
    success: true,
    message: `Detail contactList`,
    results: contactList
  })
}

exports.create = async (req,res) => {
  try {
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

    const contactList = await contactListModel.insert(col, values)
    return res.json({
      success: true,
      message: 'Create contactList successfully',
      results: contactList
    })
  }catch(err){
    handleErr.outError(err, res)
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

    const contactList = await contactListModel.update(id, col, values)
    if(contactList){
      return res.json({
        success: true,
        message: 'Update contactList successfully',
        results: contactList
      })
    }else{
      return res.status(404).json({
        success: false,
        message: 'contactList not found'
      })
    }
  }catch(err){
    handleErr.outError(err, res)
  }
}

exports.delete = async(req,res) => {
  const id = Number(req.params.id)
  const contactList = await contactListModel.delete(id)
  try {
    if(contactList){
      return res.json({
        success: true,
        message: `successfully delete contactList`,
        results: contactList
      })
    }else{
      return res.status(404).json({
        success: false,
        message: `contactList not found`
      })
    }
  }catch(err){
    handleErr.outError(err, res)
  }
}