const contactListModel = require('../../models/contactList.model')


// hendle semua error yg terjadi di catch
const handleErr = require("../../helpers/utils")


// SELECT *
exports.getAllData = async(req, res) => {
    try{
        // console.log(req.user)
        const {id} = req.user
        const getContactList = await contactListModel.allContactListforCustomer(id)

        return res.json({
            success: true,
            message: 'List all Contact List!',
            results: getContactList
        })

    } catch(err){
        handleErr.outError(err, res)
    }
}