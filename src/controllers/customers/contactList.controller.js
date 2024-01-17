const contactListModel = require('../../models/contactList.model')


// hendle semua error yg terjadi di catch
const handleErr = require("../../helpers/utils")


// SELECT *
exports.getAllData = async(req, res) => {
    try{
        const {id} = req.user
        const { search='' } = req.query
        const getContactList = await contactListModel.allContactListforCustomer(id, search)
        if(getContactList.length < 1){
            throw ({code: "THROW", message: "No Data!"})
        }

        return res.json({
            success: true,
            message: 'List all Contact List!',
            results: getContactList
        })

    } catch(err){
        handleErr.outError(err, res)
    }
}