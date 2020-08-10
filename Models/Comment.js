const mongoose=require('mongoose')
const Article = require('./Article')
const Schema=mongoose.Schema
const Comment=new Schema({
    Text:{
        type:String,
        required:true
    },
    CreateAt:{
        type:Date,
        default:Date.now
    },
    articleId:{
        type:Schema.Types.ObjectId,
        ref:Article
    }
})
module.exports=mongoose.model('Comment',Comment)