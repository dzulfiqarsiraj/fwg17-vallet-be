const contactListModel = require('../../models/contactList.model')
const userModel = require('../../models/users.model')


// hendle semua error yg terjadi di catch
const handleErr = require("../../helpers/utils")


// SELECT *
exports.getAllData = async(req, res) => {
    try{
        let getContactList
        if(req.query.phoneNumber){
            
            const phoneNumber = req.query.phoneNumber
            getContactList = await userModel.findOneByPhoneNumber(phoneNumber)
        }else{

            const {id} = req.user
            const { search='' } = req.query
            getContactList = await contactListModel.allContactListforCustomer(id, search)
        }
        if(getContactList.length < 1){
            throw ({code: "THROW", message: "No Data!"})
        }
        console.log(req.query.phoneNumber)

        return res.json({
            success: true,
            message: 'List all Contact List!',
            results: getContactList
        })

    } catch(err){
        handleErr.outError(err, res)
    }
}