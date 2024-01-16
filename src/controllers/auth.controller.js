const usersModel = require('../models/users.model')
const argon = require('argon2')
const jwt = require('jsonwebtoken')

exports.login = async (req,res) => {
  try{
    const user = await usersModel.findOneByEmail(req.body.email)
  if(user){
    const password = await argon.verify(user.password, req.body.password)
    const token = jwt.sign({
      id: user.id
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
    console.error(err)
    return res.status(500).json({
      success: false,
      message: 'internal server error'
    })
  }
}

exports.register = async (req, res)=>{
  try{
    const {email, password, fullName} = req.body
    const hash = await argon.hash(password)
    const user = await usersModel.insert({email, password: hash, fullName})
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
    console.error(err)
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}