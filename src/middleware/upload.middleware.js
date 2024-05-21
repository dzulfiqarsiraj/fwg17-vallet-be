const multer = require('multer')
const path = require('path')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const  { v2: cloudinary } = require ("cloudinary");
const { v4: uuidv4 } = require('uuid');

// const extension = {
//   'image/png' : '.png',
//   'image/jpg' : '.jpg',
//   'image/jpeg' : '.jpeg',
// }

// const storage = (dest, filename) => multer.diskStorage({
//   destination: (req,file, cb) => {
//     cb(null, path.join('uploads',dest))
//   },
//   filename: (req,file,cb) => {
//     filename = new Date().getTime()
//     cb(null,`${filename}${extension[file.mimetype]}`)
//   }
// })

// const fileFilter = (req, file, cb) => {
//   const allowedExt = Object.keys(extension)
//   if(!allowedExt.includes(file.mimetype)){
//     cb(new Error('extension_issue'), false)
//   }else{
//     cb(null, true)
//   }
// }

// const maxSize = 1 * 1024 * 1024

// const uploadMiddleware = (type, file) => {
//   const processUpload = multer({
//     storage: storage(type,file),
//     fileFilter,
//     limits: {fileSize: maxSize}
//   })
//   return processUpload
// }

// module.exports = uploadMiddleware

// Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
})


const storage = (dest) => new CloudinaryStorage({
  cloudinary,
  params: async (req, file) =>  {

      const extension = {
        "image/jpeg": "jpg",
        "image/png": "png",
        'image/jpeg' : 'jpeg',
      }

      return {
          folder: `vallet/${dest}`,
          format: extension[file.mimetype],
          public_id: uuidv4()
      }
  }
})


const fileFilter = (req, file, cb) => {
  const allowedFileTypes =['.jpeg','.jpg', '.png']

  const isExtnameAllowed = allowedFileTypes.includes(path.extname(file.originalname))
  if(isExtnameAllowed){
      cb(null, true)
  }else{
      const errorMessage = `only jpeg, jpg, and png files allowed`
      cb(new Error(errorMessage), false)
  }
}


const limits = {
  fileSize: 2 * 1024 * 1024
}


const uploadMiddleware = (dest, filename) => {
  const processUpload = multer({
      storage: storage(dest, filename),
      fileFilter: fileFilter,
      limits: limits
  })
  
  return processUpload
}


module.exports = uploadMiddleware