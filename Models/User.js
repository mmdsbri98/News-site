const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const passwordHash=require('password-hash')

const User=new Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        maxlength:20,
        minlength:2
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        maxlength:20,
        minlength:2
    },
    userName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        minlength:6
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:8
    },
    sex:{
        type:String,
        required:true,
        enum:['male','female']
    },
    phoneNumber:{
        type:String,
        unique:true,
        required:true,
        maxlength:11,
        minlength:11
    },
    Role:{
        type:String,
        enum:['admin','blogger'],
        default:'blogger'
    },
    createAt:{
        type:Date,
        default:Date.now
    },
    active:{
        type:Boolean,
        default:false
    },
    email:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:'../../image/user.jpg'
    }

})
User.pre('save',function(next){
    this.password=passwordHash.generate(this.password)
    next()
})


module.exports=mongoose.model('User',User)