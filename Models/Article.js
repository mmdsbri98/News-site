const mongoose=require('mongoose')
const { ObjectID } = require('bson')
const User = require('./User')
const Schema=mongoose.Schema

const Article=new Schema({
    Name:{
        type:String,
        required:true
    },
    Title:{
        type:String,
        required:true,
        enum:['political','social','cultural','economic']
    },
    Description:{
        type:String,
        required:true
    },
    UserId:{
        type:Schema.Types.ObjectId,
        ref:User  
    },
    Text:{
        type:String,
        required:true,
        minlength:50
    },
    createAt:{
        type:Date,
        default:Date.now
    },
    image:{
        type:String,
        default:'../../image/user.jpg'
    },
    active:{
        type:Boolean,
        default:false
    },
    hurry:{
        type:Boolean,
        default:false
    },
    seen:{
        type:Number,
    }
})
module.exports=mongoose.model('Article',Article)