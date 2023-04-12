const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: String, 
    name: String, 
    manufacturer: String, 
    description: String, 
    mainPepper: String, 
    imageUrl: String, 
    heat: {
        type: Number,
        min: 1, 
        max: 10
    },
    likes: Number, 
    dislikes: Number, 
    usersLiked: [String],
    usersDisliked: [String],
})

module.exports = mongoose.model ('Sauce', sauceSchema);