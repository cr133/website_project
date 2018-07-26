import { createConnection } from 'mongoose';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type:       String,
        unique:     true
    },
    password:       String,
    email:          String,
    loginHistory: [{
        dateTime:   Date,
        userAgent:  String
    }]
});

// 6. Once you have defined your "userSchema" 
// per the specification above, add the line: -> unsure
let User;

// initialize function
module.exports.initialize() = () => {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection('mongodb://gareth:pearen99@ds153851.mlab.com:53851/web322a06');

        db.on('error', (err) => {
            reject(err);
        });
        db.once('open', () => {
            User = db.model('users', userSchema);
            resolve();
        });
    });
};

module.exports.registerUser(userData) = () => {
    // Assignment for an object?
    const user = {
        username:    userData.userName,
        useragent:   userData.userAgent,
        email:       userData.email,
        password:    userData.password,
        password2:   userData.password2
    };

    const password1 = user.password1;
    const password2 = user.password2;
 
    // Validation part -> probably not work
    // Invalid
    if (password1 !== password2)
        reject('Passwords do not match')
    // Valid - create a new User from the userData, this line is confirmed
    let newUser = new User(userData);

    // Unsure
    newUser.save((err) => {
        if (err && err.code !== 11000)
            reject('There was an error creating the user: ' + err);
        else
            resolve();
    })
}