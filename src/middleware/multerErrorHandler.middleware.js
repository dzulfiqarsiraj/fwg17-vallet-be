const multer = require('multer')

const multerErrorHandler = (err, req, res, next) => {
    if(err instanceof multer.MulterError){
        if(err.code === 'LIMIT_FILE_SIZE'){
            return res.status(400).json({
                success: false,
                message: 'The file size exceeds 2MB limit'
            })
        }
    }else if (err.message === 'only jpeg, jpg, and png files allowed'){
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }else{
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = multerErrorHandler