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

app.get('/app', (req, res) => {
    res.status(404).send("Page Not Found");
})

data_service.initialize()
 .then(() => {
     app.listen(HTTP_PORT, onHttpStart);
 })
 .catch((err) => {
     console.log(err);
 })