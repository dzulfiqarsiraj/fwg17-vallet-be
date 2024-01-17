const usersModel = require('../models/users.model')
const argon = require('argon2')
const jwt = require('jsonwebtoken')

const handleErr = require('../helpers/utils')

exports.login = async (req,res) => {
  try{
    const user = await usersModel.findOneByEmail(req.body.email)
  if(user){
    const password = await argon.verify(user.password, req.body.password)
    const token = jwt.sign({
      id: user.userId,
      role: user.roleName
    }, process.env.APP_SECRET || 'secret')
    if(password){
      return res.json({
        success: true,
        message: 'Login Success',
        results: {
          token
        }
      })
    }else{
      throw 'wrong_password'
    }
  }else{
    throw 'wrong_password'
  }
  }catch(err){
    if(err === 'wrong_password'){
      return res.status(401).json({
        success: false,
        message: 'wrong email or password'
      })
    }
    handleErr.outError(err, res)
  }
}

exports.register = async (req, res)=>{
  try{
    if(req.body.password){
      req.body.password = await argon.hash(req.body.password)
    }

    const col = []
    const values = []

    for(let i in req.body){
      values.push(req.body[i])
      col.push(`"${i}"`)
    }

    const user = await usersModel.insert(col, values)
    if(user){
      return res.json({
        success: true,
        message: 'Register success'
      })
    }else{
      throw 'error_create_user'
    }
  }catch(err){
    if(err === 'error_create_user'){
      return res.status(400).json({
        success: false,
        message: 'Register failed'
      })
    }
    handleErr.outError(err, res)
  }
}

exports.verifyPin = async (req,res) => {
  try{
    const {id} = req.params
    const user = await usersModel.findOne(id)
  if(user){
    const pin = await argon.verify(user.pin, req.body.pin)
    if(pin){
      return res.json({
        success: true,
        message: 'Transfer Success'
      })
    }else{
      throw 'wrong_pin'
    }
  }else{
    throw 'wrong_pin'
  }
  }catch(err){
    if(err === 'wrong_pin'){
      return res.status(401).json({
        success: false,
        message: 'wrong email or pin'
      })
    }
    handleErr.outError(err, res)
  }
}