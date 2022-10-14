const Posts = require('../models/Post')

const getSinglePost = async (req, res) => {
    const {link} = req.params
    
    const post = await Posts.find({link})
    return res.status(200).json(post)
}

module.exports = {
    getSinglePost
}