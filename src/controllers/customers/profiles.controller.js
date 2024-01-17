const usersModel = require('../../models/users.model')
const argon = require('argon2')
const errorHandler = require('../../helpers/utils')
const fs = require('fs/promises')
const path = require('path')
const uploadMiddleware = require('../../middleware/upload.middleware')
upload = uploadMiddleware('profiles').single('picture')


exports.getProfile = async (req, res) => {
  try{
    const {id} = req.user
    const users = await usersModel.findOneProfile(id)
  
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

  } catch(err){
    errorHandler.outError(err, res)
  }

}

exports.updateProfile = (req, res) => {
	upload(req, res, async(err) => {
    try{
      if(err) {
        throw err
      }

      // if(req.body.password) {
      //   req.body.password = await argon.hash(req.body.password)
      // }

      const {id} = req.user
      if(req.file){
        const checkUsersData = await usersModel.findOne(id)
        if(checkUsersData.picture){
          const savedPicture = path.join(global.path, 'uploads', 'profiles', checkUsersData.picture)
          fs.access(savedPicture, fs.constants.R_OK)
          await fs.rm(savedPicture)
        }
        req.body.picture = req.file.filename
      }

      const updateUsers = await usersModel.updateProfile(id, req.body)

      return res.json({
        success: true,
        message: 'Update Payment Method Successfully',
        results: updateUsers
      })
    }catch(err){
      errorHandler.outError(err, res)
    }
  })
}