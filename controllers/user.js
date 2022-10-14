const Users = require('../models/User')

const loginUser = async (req, res) => {
    const {link} = req.params
    
    const post = await Users.find({link})
    return res.status(200).json(post)
}

module.exports = {
    loginUser
}