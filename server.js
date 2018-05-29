/****************************************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Cheolryeong Lee Student ID: 119862175 Date: 05. 26. 18
*
*  Online (Heroku) Link: https://web322a2.herokuapp.com/
*
*****************************************************************************************************/ 
var express = require('express');
var app = express();
var path = require('path');
var data_service = require('./data-service');
var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views/home.html"));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

// Step 3: Adding additional Routes
app.get('/employees', (req, res) => {
    data_service.getAllEmployees()
     .then((data) => {
         res.json(data);
     })
     .catch((err) => {
         console.log(err);
     })
})

app.get('/managers', (req, res) => {
    data_service.getManagers()
     .then((data) => {
         res.json(data);
     })
     .catch((err) => {
         console.log(err);
     })
});

app.get('/departments', (req, res) => {
    data_service.getDepartments()
     .then((data) => {
         res.json(data);
     })
     .catch((err) => {
         console.log(err);
     })
})

app.get('*', (req, res) => {
    res.status(404).send('404: page not found');
})

data_service.initialize()
 .then(() => {
     app.listen(HTTP_PORT, onHttpStart);
 })
 .catch((err) => {
     console.log(err);
 })