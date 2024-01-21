const usersModel = require('../models/users.model')
const forgotModel = require('../models/forgotPassword.model')
const forgotPin = require('../models/forgotPin.model')
const argon = require('argon2')
const jwt = require('jsonwebtoken')
const db = require('../lib/db.lib')
const walletModel = require('../models/wallet.model')
const handleErr = require('../helpers/utils')
const transport = require('../../mail.helper')

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
        const { customAlphabet } = await import("nanoid");
        const rand = customAlphabet("1234567890", 6);
        const otp = rand();

        const request = await forgotModel.insert({
          otp,
          email: user.email,
          userId: user.userId,
        });

        //nodemailer start
        const mailOptions = {
          from: "vallet.digital.app@gmail.com",
          to: request.email,
          subject: `Ini adalah Kode OTP anda ${otp}`,
          html:`
          <div>
            <p>Masukan kode 6 digit di bawah ini untuk membuat password baru dan mendapatkan kembali akses ke akun Vallet anda</p>
            <p>${otp}</p>
            <p>Terima kasih telah membantu kami menjaga keamanan akun Anda.</p>
            <p>Tim Vallet</p>
          </div>`,
        }

        const sendMail = async () => {
          try {
            const mailer = await transport();
            await mailer.sendMail(mailOptions);
            console.log("Email terkirim!");
          } catch (err) {
            console.log(err);
            console.log("Gagal!");
          }
        };

        sendMail();
        //nodemailer end

        return res.json({
          success: true,
          message: `Forgot Password for ${request.email} requested, please check your email`,
        });
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
          message: "New Password Saved"
        })
      }
    }

  } catch (err) {
    console.error(err)
    handleErr.outError(err, res)
  }
}


exports.forgotPin = async (req, res) => {
  try {
    const {email, otp, newPin, confirmPin} = req.body

    if(email){
      const user = await usersModel.findOneByEmail(email)
      if(user){
        const { customAlphabet } = await import("nanoid");
        const rand = customAlphabet("1234567890", 6);
        const otp = rand();

        const request = await forgotPin.insert({
          otp,
          email: user.email,
          userId: user.userId,
        });

        //nodemailer start
        const mailOptions = {
          from: "vallet.digital.app@gmail.com",
          to: request.email,
          subject: `Ini adalah Kode OTP anda ${otp}`,
          html: `
                  <div>
                    <p>Masukan kode 6 digit di bawah ini untuk membuat pin baru dan mendapatkan kembali akses ke berbagai feature di akun Vallet anda</p>
                    <p>${otp}</p>
                    <p>Terima kasih telah membantu kami menjaga keamanan akun Anda.</p>
                    <p>Tim Vallet</p>
                  </div>`,
        };

        const sendMail = async () => {
          try {
            const mailer = await transport();
            await mailer.sendMail(mailOptions);
            console.log("Email terkirim!");
          } catch (err) {
            console.log(err);
            console.log("Gagal!");
          }
        };

        sendMail();
        //nodemailer end

        return res.json({
          success: true,
          message: `Forgot Pin for ${request.email} requested, please check your email`,
        });
      }
       throw 'email not registered'
    }else{
      if(otp){
        const found = await forgotPin.findOnebyOtp(otp)
        if(!found){
          throw 'wrong otp'
        }
        // logic untuk melakukan check expired otp
        // cratedAt + 15 > date.now then throw 'expired_otp'

        const user = await usersModel.findOneByEmail(found.email)

        if(newPin !== confirmPin){
          throw 'Confirm pin does not match'
        }

        const hash = await argon.hash(newPin)
        const update = await usersModel.updateProfile(user.userId, {
          pin: hash
        })

        if(!update){
          throw 'create new pin failed, try again!'
        }

        await forgotPin.delete(found.id)

        return res.json({
          success: true,
          message: "New Pin Saved"
        })
      }
    }

  } catch (err) {
    console.error(err)
    handleErr.outError(err, res)
  }
}