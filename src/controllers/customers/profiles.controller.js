const usersModel = require('../../models/users.model')

exports.getProfile = async (req, res) => {
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

}