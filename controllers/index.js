const Posts = require('../models/Post')

const viewHome = async (req, res) => {
    // const posts = await Posts.find()
    return res.status(200).render('home')
}

module.exports = {
    viewHome
}