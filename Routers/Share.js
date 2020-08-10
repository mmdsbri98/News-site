const express=require('express');
const root=express.Router()
const path=require('path')
const User=require('../Models/User')
const Article=require('../Models/Article')
const passwordHash=require('password-hash')
const multer=require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'Public/image')
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now()+'-'+file.originalname )
    }
  })
   
  var upload = multer({ storage: storage })

let exist=function(username){
    return new Promise(async function(resolve,reject){
        let user=await User.findOne({userName:username})
        if(user){
            resolve(user)
        }else{
            reject('user is not define')
        }

    })
}
root.get('/uploadimage/:username',function(req,res){
    massage=[]
    let username=req.params.username
    massage.push(username)
    res.render(path.join(__dirname,'../Views/upload.ejs'),massage)
})
root.post('/uploadimage/:username',async function(req,res){
    massage=[]
    let username=req.params.username
    massage.push(username)
    
   
    
    var upload1=upload.single('avatar')
    upload1(req,res,async function(err){
        if(err){
            massage.push('ERROR!')
            res.render(path.join(__dirname,'../Views/upload.ejs'),{massage})
        } 

        address=`../../image/${req.file.filename}`
        let user=await User.findOneAndUpdate({userName:username},{$set:{image:address}},{new:true})
        if(user.Role==="admin"){
            res.redirect(`/admin/dashboard/${user._id}`)
        }
        if(user.Role==="blogger"){
            res.redirect(`/blogger/dashboard/${user._id}`)
        }

    })
})
root.get('/changePassword/:id',async function(req,res){
    try{
         id =req.params.id 
         massage=[]
         let user=await User.findOne({_id:id})
         massage.push(user)
         res.render(path.join(__dirname,'../Views/changePassword.ejs'),{massage})

    }catch{

         throw new Error('azizam!');
         
    }
})
root.post('/changePassword/:id',async function(req,res){
    
         id =req.params.id 
         massage=[]
         password=passwordHash.generate(req.body.new)
         let count;
         let user=await User.findOne({_id:id})
         if(user){
             count= passwordHash.verify(req.body.before,user.password)
             massage.push(user)
         }
        
         if(count===false){
              massage.push('before password is not valid')
         }
         if(req.body.new.length<9){
              massage.push('new password is short')
         }
         if(massage.length===1){
              let user2=await User.findOneAndUpdate({_id:id},{$set:{password:password}},{new:true})
              if(user2.Role==='blogger'){
                  res.redirect(`/blogger/dashboard/${user2._id}`)
              }
              if(user2.Role==='admin'){
                res.redirect(`/admin/dashboard/${user2._id}`)
            }
              
         }else{
              res.render(path.join(__dirname,'../Views/changePassword.ejs'),{massage})
         }
        
         

    

})
root.get('/editProfile/:id',async function(req,res){
    let id=req.params.id
    
    let user=await User.findOne({_id:id});
    console.log(user);
    
    res.render(path.join(__dirname,'../Views/editProfile'),{user})
})
root.post('/editProfile/:id',async function(req,res){
    let id=req.params.id
    let user=await User.findOneAndUpdate({_id:id},{$set:{userName:req.body.userName,email:req.body.email,lastName:req.body.lastName,firstName:req.body.firstName,phoneNumber:req.body.phoneNumber}},{new:true})

         if(user){
              console.log(user);
              if(user.Role==='blogger'){
                  res.redirect(`/blogger/dashboard/${user._id}`)
              }
              if(user.Role==='admin'){
                res.redirect(`/admin/dashboard/${user._id}`)
              }
         }
      
       
})

root.get('/myArticles/:id',async function(req,res){
    let id =req.params.id;
    let article=await Article.find({UserId:id});
    res.render(path.join(__dirname,'../Views/myArticles.ejs'),{article})
})

module.exports=root