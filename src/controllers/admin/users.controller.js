const usersModel = require('../../models/users.model')


// error hendler
const hendelErr = require('../../helpers/utils')


// SELECT * => memanggil semua users
exports.getAllUsers = async(req, res) => {
    try {
        const {filter} = req.query
        const listUsers = await usersModel.allUsers()

        return res.json({
            success: true,
            message: "List all users",
            results: listUsers
        })
    } catch(err) {
        hendelErr.outError(err, res)
    }
}