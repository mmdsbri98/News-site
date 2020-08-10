const express = require('express');
const root = express.Router()
const path = require('path')
const User = require('../Models/User')
const multer=require('multer');
const Article = require('../Models/Article');
const Comment = require('../Models/Comment');
const {
    findOneAndUpdate
} = require('../Models/User');
const {
    rootCertificates
} = require('tls');
const { read } = require('fs');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'Public/image')
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now()+'-'+file.originalname )
    }
  })
   
  var upload = multer({ storage:storage})
  

root.get('/createArticle/:id', function (req, res) {
    let massage = []
    let id = req.params.id
    massage.push(id)
    res.render(path.join('../Views/createArticle.ejs'), {
        massage
    })
})
root.post('/createArticle/:id', async function (req, res) {
    let massage = []
    let id = req.params.id
    massage.push(id)
    if (req.body.Text.length < 50) {
        massage.push('text is short')
    }
    if (!req.body.Name) {
        massage.push('Name is required')
    }
    if (!req.body.Title) {
        massage.push('Title is required')
    }
    if (!req.body.Description) {
        massage.push('Description is required')
    }
    if (!req.body.Text) {
        massage.push('Text is required')
    }
    if (massage.length > 1) {
        res.render(path.join('../Views/createArticle.ejs'), {
            massage
        })

    } else { 
    
        let NEW_ARTICLE = new Article({
            Name: req.body.Name,
            Title: req.body.Title,
            Description: req.body.Description,
            Text: req.body.Text,
            UserId: id,
            seen:0
        })
        await NEW_ARTICLE.save(function (err) {
            console.log(err);

        })
        
        console.log(NEW_ARTICLE._id);
      
        res.redirect(`/article/uploadPhoto/${id}/${NEW_ARTICLE._id}`)
        
    }

})
root.get('/uploadPhoto/:user/:article',async function(req,res){
    user=req.params.user
    article=req.params.article
    res.render(path.join(__dirname,'../Views/uploadPhoto'),{user:user,article:article})
})
root.post('/uploadPhoto/:user/:article',async function(req,res){
    user=req.params.user
    article=req.params.article
    var upload1=upload.single('avatar')
    upload1(req,res,async function(err){
        if(err){
            massage.push('ERROR!')
           
        } 
       
            address=`../../image/${req.file.filename}`
        
        
        await Article.findOneAndUpdate({_id:article},{$set:{image:address}},{new:true})
        await User.findOne({_id:user},function(err,users){
            if(err){
                console.log(err);
            }else{
                if(users.Role==='blogger'){
                    res.redirect(`/blogger/dashboard/${user}`)
                }
                if(users.Role==='admin'){
                    res.redirect(`/admin/dashboard/${user}`)
                }

            }
        })
        
    })
})
root.get('/showArticles', async function (req, res) {
    let Articles = await Article.find({})
    res.render(path.join(__dirname, '../Views/showArticlesadmin.ejs'), {
        Articles
    })
})
root.get('/activeArticle/:id', function (req, res) {
    let id = req.params.id
    console.log(id);

    Article.findOneAndUpdate({
        _id: id
    }, {
        active: true
    }, {
        new: true
    }, function (err, user) {
        if (err) {
            console.log(err);

        } else {
            res.redirect('/article/showArticles')
        }
    })

})

root.get('/deleteArticle/:id', function (req, res) {
    let id = req.params.id
    console.log(id);

    Article.findOneAndDelete({
        _id: id
    }, function (err) {
        if (err) {
            console.log(err);

        } else {
            res.redirect('/article/showArticles')
        }
    })

})
root.get('/showArticle/:id', async function (req, res) {
    let id = req.params.id;
    let pass=[]
    let comments=await Comment.find({articleId:id})
    
    let article=await Article.findOne({ _id: id})
    pass.push(article)
    pass.push(comments)
    if(article){
        res.render(path.join(__dirname, '../Views/showArticle.ejs'), {
            pass
        })
    }
            
        
    })

root.get('/delete/:id', async function (req, res) {
    let id = req.params.id;
    let article = await Article.findOne({
        _id: id
    })
    await Article.findOneAndDelete({
        _id: id
    }, function (err) {
        if (err) {
            console.log(err);

        } else {
            res.redirect(`/share/myArticles/${article.UserId}`)
        }
    })
})

root.get('/edit/:id', async function (req, res) {
    let id = req.params.id;
    massage = []
    let article = await Article.findOne({
        _id: id
    })
    massage.push(article)
    res.render(path.join(__dirname, '../Views/editArticle.ejs'), {
        massage
    })
})
root.post('/edit/:id', async function (req, res) {
    let id = req.params.id;
    let article = await Article.findOne({
        _id: id
    })
    let user = await User.findOne({
        _id: article.UserId
    })
    await Article.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            Name: req.body.Name,
            Text: req.body.Text,
            Title: req.body.Title,
            Description: req.body.Description
        }
    }, {
        new: true
    }, (err, ar) => {
        if (err) {
            console.log(err);

        } else {
            if (user.Role === 'blogger') {
                res.redirect(`/blogger/dashboard/${user._id}`)
            }
            if (user.Role === 'admin') {
                res.redirect(`/admin/dashboard/${user._id}`)
            }
        }
    })

})
 
root.post('/addComment/:id',async function(req,res){
    let id=req.params.id;
    console.log(req.body.com);
    let NEW_COMMENT=new Comment({
        Text:req.body.com,
        articleId:id
    })
    NEW_COMMENT.save((err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect(`/article/showArticle/${id}`)
        }
    })

})



module.exports = root