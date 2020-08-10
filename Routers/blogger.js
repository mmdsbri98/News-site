const express=require('express');
const root=express.Router()
const path=require('path')
const User=require('../Models/User');
const Article=require('../Models/Article');
const passwordHash=require('password-hash')
const { updateOne, findOneAndUpdate } = require('../Models/User');

root.get('/dashboard/:id',async(req,res)=>{
     let id=req.params.id;
     
     
     let user=await User.findOne({_id:id});
     res.render(path.join(__dirname,'../Views/dashboardBlogger.ejs'),{user})
})



module.exports=root