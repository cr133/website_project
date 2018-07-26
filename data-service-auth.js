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
    
}