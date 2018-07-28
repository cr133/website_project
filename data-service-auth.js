const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
// per the specification above, add the line
let User;

// initialize function
module.exports.initialize = () => {
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

module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        if (userData.password !== userData.password2)
            reject('Passwords do not match');

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(userData.password, salt, (err, hash) => {
                if (err)
                    reject('There was an error encrypting the password');
                userData.password = hash;
            })
        })
        let newUser = new User(userData);

        newUser.save((err) => {
            if (err && err.code === 11000)
                reject('User Name already taken');
            else if (err && err.code !== 11000)
                reject('There was an error creating the user: ' + err);
            else
                resolve();
        })
    })
}

module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
        User.find({ userName: userData.userName })
         .exec()
         .then((user) => {
            bcrypt.compare(userData.password, user[0].password).then((res) => {
               if (res)
                    resolve();
               else {
                    if (user.length === 0) 
                        reject('Unable to find user: ' + userData.userName);
                    if (user[0].password !== userData.password)
                        reject('Incorrect Password for user: ' + userData.userName);
               }
            })
            var loginHistory = [];
            // Push objects
            loginHistory.push(
                { dateTime: (new Date()).toString(),
                  userAgent: userData.userAgent }
            )
            // Invoke update method
            User.update({ userName: userData.userName },
                // Will need to modify
                { $set: { loginHistory: loginHistory }})
                .exec()
                .then(() => {
                    resolve(user);
                })
                .catch((err) => {
                    reject('There was an error verifying the user: ' + err);
                })
         })
         .catch(() => {
             // user in the note but probably userName is correct
             reject('Unable to find user: ' + userData.userName);
         })
    })
}