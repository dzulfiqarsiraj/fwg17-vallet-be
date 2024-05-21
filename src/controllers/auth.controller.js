const usersModel = require('../models/users.model')
const otpModel = require('../models/otp.model')
const argon = require('argon2')
const jwt = require('jsonwebtoken')
const walletModel = require('../models/wallet.model')
const handleErr = require('../helpers/utils')
const transporter = require('../lib/mail.lib')

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
      throw 'wrong password!'
    }

  }else{
    throw 'Email not registered!'
  }

  }catch(err){
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
        message: 'Verify Pin Success'
      })
    }else{
      throw 'Incorrect Pin'
    }

  }else{
    throw 'user not found'
  }
  }catch(err){
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
      throw 'wrong existing password'
    }

  }else{
    throw 'user not found'
  }
  }catch(err){
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

        const request = await otpModel.insert({
          otp,
          email: user.email,
          userId: user.userId,
        });

        //nodemailer start
        const mailOptions = {
          from: 'Vallet Team <no-reply@gmail.com>',
          to: request.email,
          subject: `Here is your OTP code ${otp}`,
          html:`
          <div>
            <p>Enter the 6-digit code below to create a new password and regain access to your Vallet account</p>
            <p>${otp}</p>
            <p>Thank you for helping us maintain the security of your account.</p>
            <p>Vallet Team</p>
          </div>`,
        }

        const sendMail = async () => {
          try {
            const mailer = await transporter();
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
          message: `OTP has been sent to your email`,
        });
      }
       throw 'email not registered'
    }else{
      if(otp){
        const found = await otpModel.findOnebyOtp(otp)
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

        await otpModel.delete(found.id)

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
    const {email, otp, newPin} = req.body

    if(email){
      const user = await usersModel.findOneByEmail(email)
      if(user){
        const { customAlphabet } = await import("nanoid");
        const rand = customAlphabet("1234567890", 6);
        const otp = rand();

        const request = await otpModel.insert({
          otp,
          email: user.email,
          userId: user.userId,
        });

        //nodemailer start
        const mailOptions = {
          from: 'Vallet Team <no-reply@gmail.com>',
          to: request.email,
          subject: `Here is your OTP code ${otp}`,
          html: `
                  <div>
                    <p>Enter the 6-digit code below to create a new pin</p>
                    <p>${otp}</p>
                    <p>Thank you for helping us maintain the security of your account.</p>
                    <p>Vallet Team</p>
                  </div>`,
        };

        const sendMail = async () => {
          try {
            const mailer = await transporter();
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
          message: `OTP has been sent to your email`,
        });
      }
       throw 'email not registered'
    }else{
      if(otp){
        const found = await otpModel.findOnebyOtp(otp)
        if(!found){
          throw 'wrong otp'
        }
        // logic untuk melakukan check expired otp
        // cratedAt + 15 > date.now then throw 'expired_otp'

        const user = await usersModel.findOneByEmail(found.email)

        const hashedPin = await argon.hash(newPin)
        const update = await usersModel.updateProfile(user.userId, {
          pin: hashedPin
        })

        if(!update){
          throw 'create new pin failed, try again!'
        }

        await otpModel.delete(found.id)

        return res.json({
          success: true,
          message: "New Pin Saved"
        })
      }
    }

  } catch (err) {
    handleErr.outError(err, res)
  }
}


exports.findUserByEmail = async (req, res) => {
  try {
    const user = await usersModel.findOneByEmail(req.query.email)

    return res.json({
      success: true,
      message: `Detail users`,
      results: user
    })
  } catch (error) {
    handleErr.outError(error, res)
  }
}


exports.findUserByPhone = async (req, res) => {
  try {
    const user = await usersModel.findOneByPhone(req.query.phoneNumber)

    return res.json({
      success: true,
      message: `Detail users`,
      results: user
    })
  } catch (error) {
    handleErr.outError(error, res)
  }
}