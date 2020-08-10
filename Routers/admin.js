const express = require('express');
const root = express.Router()
const path = require('path')
const User = require('../Models/User')


root.get('/dashboard/:id', async (req, res) => {
     let id = req.params.id;
     let user = await User.findOne({
          _id: id
     });
     res.render(path.join(__dirname, '../Views/dashboardadmin.ejs'), {
          user
     })
})
root.get('/showAdmins', async function (req, res) {
     let users = await User.find({
          Role: 'blogger'
     })
     res.render(path.join(__dirname, '../Views/showAdmins.ejs'), {
          users
     })
})
root.get('/activate/:id', function (req, res) {

    id = req.params.id;
     User.findOneAndUpdate({
          _id: id
     }, {
          active: true
     }, {
          new: true
     }, function (err, user) {
          if (err) {
               console.log(err);

          } else {
               console.log(user);

               res.redirect('/admin/showAdmins')
          }

     })


})
root.get('/unactivate/:id',async function (req, res) {
     console.log('ble');
     
     id = req.params.id;
      await User.findOneAndUpdate({
           _id: id
      }, {
           active: false
      }, {
           new: true
      }, function (err, user) {
           if (err) {
                console.log(err);
 
           } else {
                console.log(user);
 
                res.redirect('/admin/showAdmins')
           }
 
      })
 
 
 })
 


module.exports = root