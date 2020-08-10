const express=require('express');
const root=express.Router()
const path=require('path')
const User=require('../Models/User')
const passwordHash=require('password-hash')
const multer=require('multer');
const { findOne } = require('../Models/User');
function isLoggedIn(req,res,next){
    if(req.session.user){
        if(req.session.user.Role==='blogger'){
            return res.redirect(`/blogger/dashboard/${req.session.user._id}`)
        }
       
        if(req.session.user.Role==='admin'){
                return res.redirect(`/admin/dashboard/${req.session.user._id}`)
        }

       
    
}
next()
}



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
        await User.findOneAndUpdate({userName:username},{$set:{image:address}},{new:true})
        res.redirect('/register/login')
    })
})

root.get('/createUser',function(req,res){
    let err=[]
    res.render(path.join(__dirname,'../Views/register.ejs'),{err})
      
})
root.post('/createUser',function(req,res){
    let err=[]
    exist(req.body.userName).then(
        function(result){
            err.push('username is available\n')
        }
        
    ).catch(
        function(error){
               console.log('ok');
               
    })
    // User.findOne({userName:`${req.body.userName}`},function(err,user){
    //     if(user){
    //         err.push('username is available\n')
    //     }
    // })
    reg=/^(\ +98|0)?9\d{9}$/
    if(!req.body.phoneNumber.match(reg) ||req.body.phoneNumber.length!==11){
        err.push('phone is not valid')
    }
    if(req.body.userName.length<6){
        err.push('length username is short')
        console.log('mmd');
        
    }
    if(req.body.password.length<8){
        err.push('length password is short')
    }
    if(req.body.lastName.length<2 ||req.body.lastName.length>20){
        err.push('lastname is not valid')
    }
    if(req.body.firstName.length<2 ||req.body.firstName.length>20){
        err.push('firstname is not valid')
    }
    if(!req.body.lastName ||!req.body.firstName || !req.body.userName || !req.body.password || !req.body.sex || !req.body.phoneNumber || !req.body.email ){
         if(!req.body.lastName){
             err.push('lastname is require\n')
         }
         if(!req.body.firstName){
            err.push('firstname is require\n')
        }
        if(!req.body.password){
            err.push('password is require\n')
        }
        if(!req.body.sex){
            err.push('gender is require\n')
        }
        if(!req.body.phoneNumber){
            err.push('phonenumber is require\n')
        }
        if(!req.body.userName){
            err.push('username is require\n')
        }
        if(!req.body.email){
            err.push('email is require\n')
        }
        
        

    }
    if(err.length===0){
        const NEW_USER=new User({
            lastName:req.body.lastName,
            firstName:req.body.firstName,
            sex:req.body.sex,
            phoneNumber:req.body.phoneNumber,
            email:req.body.email,
            password:req.body.password,
            userName:req.body.userName,
        })
        NEW_USER.save(function(err){
            if(err){
                console.log(err);
                
            }
        })  
        
        res.redirect(`/register/uploadimage/${req.body.userName}`)
    }else{
        res.render(path.join(__dirname,'../Views/register.ejs'),{err})
    }
})
root.get('/login',isLoggedIn,function(req,res){
    let massage=[]
    res.render(path.join(__dirname,'../Views/login.ejs'),{massage})
})
root.post('/login',async(req,res)=>{
    let username=req.body.userName;
    let password=req.body.password;
    console.log(username, password);
    
    let massage=[]
    let count
    let user1=await User.findOne({userName:username});
    
    
    if(user1){
        count=passwordHash.verify(password,user1.password)
    }
    if(req.body.userName &&!user1){
        massage.push('user is not found\n')
    }
    if(user1 && !count){
        massage.push('password is not valid\n')
    }
    if(!req.body.userName){
        massage.push('usesrname is require\n')
    }
    if(!req.body.password){
        massage.push('password is require\n')
    }
    if(massage.length!==0){
        res.render(path.join(__dirname,'../Views/login.ejs'),{massage})
    }
    if(massage.length===0 && user1.Role==="blogger"){
        req.session.user=user1
        res.redirect(`../blogger/dashboard/${user1._id}`)
    }
    if(massage.length===0 && user1.Role==="admin"){
        req.session.user=user1
        res.redirect(`../admin/dashboard/${user1._id}`)
    }
    
})
root.get('/forgetPassword',async function(req,res){
    res.render(path.join(__dirname,'../Views/forgetPassword.ejs'))
})
root.post('/forgetPassword',async function(req,res){
    let user=await User.findOne({userName:req.body.userName})
    await User.findOneAndUpdate({userName:req.body.userName},{$set:{password:passwordHash.generate(user.phoneNumber)}},{new:true},function(err,us){
        if(err){
            console.log(err);
        }else{
            res.redirect('/register/login')
        }
    })
})




module.exports=root;