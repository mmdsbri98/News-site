const User = require('../Models/User')
const mongoose = require('mongoose')
module.exports = async () => {
    try {
        let admin = await User.findOne({
            Role: 'admin'
        })
        if (admin) {
            console.log('admin register before');

        } else {
            const NEW_USER = new User({
                firstName: 'mohammad',
                lastName: 'saberi',
                userName: 'mmdsbri98',
                password: 'mmdsbri98',
                sex: 'male',
                phoneNumber: '09120153837',
                Role: 'admin',
                active: true,
                email: 'mmdsbri98@gmail.com'

            })
            NEW_USER.save(function (err) {
                console.log(err);

            })
        }
    } catch {
        console.log('ERROR!');

    }
}