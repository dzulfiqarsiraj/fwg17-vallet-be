const usersModel = require('../models/users.model')
const forgotModel = require('../models/forgotPassword.model')
const argon = require('argon2')
const jwt = require('jsonwebtoken')
const db = require('../lib/db.lib')
const walletModel = require('../models/wallet.model')
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

    if(req.body.pin){
      req.body.pin = await argon.hash(req.body.pin)
    }

    const col = []
    const values = []

    for(let i in req.body){
      values.push(req.body[i])
      col.push(`"${i}"`)
    }

    const user = await usersModel.insert(col, values)
    const {id} = user
    // console.log(id)
    await walletModel.insert(id)
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

exports.verifyPassword = async (req,res) => {
  try{
    const {id} = req.params
    const user = await usersModel.findOne(id)
  if(user){
    const password = await argon.verify(user.password, req.body.password)
    if(password){
      return res.json({
        success: true,
        message: 'Password Correct'
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


exports.forgotPassword = async (req, res) => {
  try {
    const {email, otp, newPassword, confirmPassword} = req.body

    if(email){
      const user = await usersModel.findOneByEmail(email)
      if(user){
        // const otp = String(Math.round(Math.random() * 100000)).padEnd(6, '0')
        const {customAlphabet}  = await import('nanoid')
        const rand = customAlphabet('1234567890', 6)
        const otp = rand()
        console.log(otp)

        const request = await forgotModel.insert({
          otp,
          email: user.email,
          userId: user.userId
        })

        // logic untuk mengirimkan otp ke email ...

        return res.json({
          success: true,
          message: `Forgot Password for ${request.email} requested, please check your email`
        })
      }
       throw 'email not registered'
    }else{
      if(otp){
        const found = await forgotModel.findOnebyOtp(otp)
        if(!found){
          throw 'wrong otp'
        }
        // logic untuk melakukan check expired otp
        // cratedAt + 15 > date.now then throw 'expired_otp'

        const user = await usersModel.findOneByEmail(found.email)

        if(newPassword !== confirmPassword){
          throw 'Confirm password does not match'
        }

        const hash = await argon.hash(newPassword)
        const update = await usersModel.updateProfile(user.userId, {
          password: hash
        })

        if(!update){
          throw 'create new password failed, try again!'
        }

        await forgotModel.delete(found.id)

        return res.json({
          success: true,
          message: "New password saved"
        })
      }
    }

  } catch (err) {
    console.error(err)
    handleErr.outError(err, res)
  }
}