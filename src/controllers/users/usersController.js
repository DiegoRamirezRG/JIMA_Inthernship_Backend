
module.exports = {

    async getUsers(req, res, next){
        return res.status(201).json({success: true, data: 'Si jala'})
    }

}