const db = require('../../lib/db.lib')
const usersModel = require('../../models/users.model')
const argon = require('argon2')
const errorHandler = require('../../helpers/utils')
const  { v2: cloudinary } = require ("cloudinary");
// const fs = require('fs/promises')
// const path = require('path')
// const uploadMiddleware = require('../../middleware/upload.middleware')
// upload = uploadMiddleware('profiles').single('picture')


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

// exports.updateProfile = async (req, res) => {
// 	upload(req, res, async(err) => {
//     try{
//       if(err) {
//         throw err
//       }

      
    // if(req.body.pin){
    //   req.body.pin = await argon.hash(req.body.pin)
    // }

      // if(req.body.password) {
      //   req.body.password = await argon.hash(req.body.password)
      // }

//       const {id} = req.user
//       if(req.body.picture == 'null'){
//         req.body.picture = null

//         const checkUsersData = await usersModel.findOne(id)
//         if(checkUsersData.picture){
//           const savedPicture = path.join(global.path, 'uploads', 'profiles', checkUsersData.picture)

//           fs.access(savedPicture, fs.constants.R_OK).then(() => {
//             fs.rm(savedPicture)
//           }).catch(()=>{})
//         }
//       }

//       if(req.file){
//         const checkUsersData = await usersModel.findOne(id)
//         if(checkUsersData.picture){
//           const savedPicture = path.join(global.path, 'uploads', 'profiles', checkUsersData.picture)
//           fs.access(savedPicture, fs.constants.R_OK).then(() => {
//             fs.rm(savedPicture)
//           }).catch(()=>{})
//         }
//         req.body.picture = req.file.filename
//       }

//       const updateUsers = await usersModel.updateProfile(id, req.body)

//       return res.json({
//         success: true,
//         message: 'Update profile Successfully',
//         results: updateUsers
//       })
//     }catch(err){
//       errorHandler.outError(err, res)
//     }
//   })
// }

exports.updateProfile = async (req, res) => {
  try {
    const {id} = req.user
    const data = await usersModel.findOne(id)

    if(req.body.password) {
      req.body.password = await argon.hash(req.body.password)
    }

    if(req.body.pin) {
      req.body.pin  = await argon.hash(req.body.pin)
    }


    if(req.body.picture == 'null'){
      console.log('delete picture')
      req.body.picture = null

      // if(checkUsersData.picture){
      //   const savedPicture = path.join(global.path, 'uploads', 'profiles', checkUsersData.picture)

      //   fs.access(savedPicture, fs.constants.R_OK).then(() => {
      //     fs.rm(savedPicture)
      //   }).catch(()=>{})


      cloudinary.search
      .expression(`${encodeURIComponent(data.picture)}`)
      .max_results(1)
      .execute()
      .then(result => {
          cloudinary.uploader.destroy(result.resources[0].public_id)
          .then(result => console.log({...result, message: "delete picture success"}))
          .catch(err => {
              return errorHandler(err, res)
          })
      }).catch(err => {
          return errorHandler(err, res)
      })
    }

    
    if(req.file){
      console.log('update picture')
      // if(checkUsersData.picture){
      //   const savedPicture = path.join(global.path, 'uploads', 'profiles', checkUsersData.picture)
      //   fs.access(savedPicture, fs.constants.R_OK).then(() => {
      //     fs.rm(savedPicture)
      //   }).catch(()=>{})
      // }
      // req.body.picture = req.file.filename


      if(data.picture){
        cloudinary.search
        .expression(`${encodeURIComponent(data.picture)}`)
        .max_results(1)
        .execute()
        .then(result => {
            cloudinary.uploader.destroy(result.resources[0].public_id)
            .then(result => console.log({...result, message: "delete picture success"}))
            .catch(err => {
                return errorHandler(err, res)
            })
        }).catch(err => {
            return errorHandler(err, res)
        })
      }
    
      req.body.picture = req.file.path
    }

    const updateUsers = await usersModel.updateProfile(id, req.body)

    return res.json({
      success: true,
      message: 'Update profile Successfully',
      results: updateUsers
    })
    
  } catch (err) {
    console.log(err)
    errorHandler.outError(err, res)
  }
}
