
function checkSession(req,res,next){
    if(!req.session.user){
        return res.redirect('/register/login')
    }
    next()
}
const express=require('express');
const mongoose=require('mongoose');
const register=require('./Routers/register')
const blogger=require('./Routers/blogger')
const admin=require('./Routers/admin')
const article=require('./Routers/article')
const share=require('./Routers/Share')
const path =require('path')
const Article=require('./Models/Article')
const cookieparser=require('cookie-parser')
const session=require('express-session')
const app=express()
const bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cookieparser())
app.use(session({
    key:'user',
    secret:"somerisetuffs",
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:600000
    }

}))
require('./Tools/registerAdmin')()
app.set('view engine','ejs')
app.use(express.static('Public'))
app.use('/register',register)
app.use('/blogger',checkSession,blogger)
app.use('/admin',checkSession,admin)
app.use('/article',checkSession,article)
app.use('/Share',checkSession,share)


mongoose.connect(
    'mongodb://localhost:27017/Finally_Project',
    {useUnifiedTopology:true,useNewUrlParser:true,useFindAndModify:false}
)

app.get('/',async function(req,res){
    let articles=await Article.find({})
    res.render(path.join(__dirname,'./Views/Home.ejs'),{articles})
})
app.get('/showArticles',async function(req,res){
    let Articles=await Article.find({})
    res.render(path.join(__dirname,'./Views/showArticles.ejs'),{Articles})
    
})
app.get('/logOut',function(req,res){
    req.session.destroy()
    res.redirect('/')
})







app.listen(3000,function(err){
    if(err){
        console.log(err);
        
    }else{
        console.log('server is running port 3000');
        
    }
})