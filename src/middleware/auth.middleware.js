const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next) => {
  try{
    const rawToken = req.headers.authorization || ''
    const prefix = 'Bearer '
    
    if(!rawToken.startsWith(prefix)){
      throw Error('invalid')
    }

    const token = rawToken.slice(prefix.length)
    req.user = jwt.verify(token, process.env.APP_SECRET || 'secretkey')
    next()
    

  }catch(err){
    switch(err.code || err.message){
      case 'invalid':
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        })
      break;
      default:
        return res.json({
          success: false,
          message: 'internal server error'
        })
    }
  }
}

module.exports = authMiddleware