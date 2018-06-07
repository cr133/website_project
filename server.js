/****************************************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Cheolryeong Lee Student ID: 119862175 Date: 07. 06. 18
*
*  Online (Heroku) Link: https://web322a3.herokuapp.com/
*
*****************************************************************************************************/ 
var express = require('express');
var app = express();
var path = require('path');
var data_service = require('./data-service');
// A3. Add multer
var multer = require('multer');
var storage = multer.diskStorage({
    destination: './public/images/uploaded',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({storage: storage});
// A3. Add "fs" module
var fs = require('fs');
// A3. Add "body-parser"
var bodyParser = require('body-parser');
// A3. Add "querystring"
var querystring = require('querystring');
var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
// A3. Add urlencoded
app.use(bodyParser.urlencoded({extended: true}));

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
// A3. Add filters
app.get('/employees', (req, res) => {
    if (Object.keys(req.query) == 'status') {
        data_service.getEmployeesByStatus(req.query.status)
         .then((data) => {
             res.json(data);
         })
         .catch((err) => {
            res.send(err);
         })
    }
    else if (Object.keys(req.query) == 'department') {
        data_service.getEmployeesByDepartment(req.query.department)
         .then((data) => {
             res.json(data);
         })
         .catch((err) => {
            res.send(err);
         })
    }
    else if (Object.keys(req.query) == 'manager') {
        data_service.getEmployeesByManager(req.query.manager)
         .then((data) => {
             res.json(data);
         })
         .catch((err) => {
             res.send(err);
         })
    }
    else {
        data_service.getAllEmployees()
         .then((data) => {
            res.json(data);
         })
         .catch((err) => {
            res.send(err);
         })
    }
});

// A3. Add /employee/value route
app.param('num', (req, res, next) => {
    next();
});
app.get('/employees/:num/', (req, res) => {
    data_service.getEmployeeByNum(req.params.num)
     .then((data) => {
         res.json(data);
     })
     .catch((err) => {
         res.send(err);
     })
});

app.get('/managers', (req, res) => {
    data_service.getManagers()
     .then((data) => {
         res.json(data);
     })
     .catch((err) => {
        res.send(err);
     })
});

app.get('/departments', (req, res) => {
    data_service.getDepartments()
     .then((data) => {
         res.json(data);
     })
     .catch((err) => {
        res.send(err);
     })
});

// A3. Append ../add routes
app.get('/employees/add', (req, res) => {
    res.sendFile(path.join(__dirname, "views/addEmployee.html"));
});

app.get('/images/add', (req, res) => {
    res.sendFile(path.join(__dirname, "views/addImage.html"));
});

// A3. Adding the POST route
app.post('/images/add', upload.single('imageFile'), (req, res) => {
    res.redirect('/images');
});

app.post('/employees/add', (req, res) => {
    data_service.addEmployee(req.body)
     .then(() => {
        res.redirect('/employees');
     });
});

// A3. Add GET route using the "fs" module
app.get('/images', (req, res) => {
    fs.readdir('./public/images/uploaded/', (err, items) => {
        res.json(items);
    });
});

// 404 Error page
app.get('*', (req, res) => {
    res.status(404).send('404: page not found');
});

data_service.initialize()
 .then(() => {
     app.listen(HTTP_PORT, onHttpStart);
 })
 .catch((err) => {
     res.send(err);
 });