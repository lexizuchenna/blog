const Posts = require('../models/Post')

const getSinglePost = async (req, res) => {
    const {link, author} = req.params
    console.log(author)
    console.log(link)
    
    //const post = await Posts.find({link})
    return res.status(200).render('posts/post')
}

const getPostsByCategory = async (req, res) => {
    const {category} = req.query
    console.log(category)
    //const posts = await Posts.find({category})
    return res.status(200).render('posts/category')
}

module.exports = {
    getSinglePost, getPostsByCategory
}