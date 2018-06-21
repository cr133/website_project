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
// A4. Add "express-handlebars"
var exphbs = require('express-handlebars');
var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
// A3. Add urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// A4. enable .hbs extention
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        // A4. Highlight a current page
        navLink: (url, options) => {
            return '<li' +
            ((url == app.locals.activeRoute) ? 
                ' class="active"' : '') +
                '><a href="' + url + '">' + options.fn(this)
                + '</a></li>';
        },
        equal: (lvalue, rvalue, options) => {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue)
                return options.inverse(this);
            else
                return options.fn(this);
        }
    }
}));
app.set('view engine', '.hbs');

// A4. Find active route
app.use((req, res, next) => {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = 
        (route == '/') ? '/' : route.replace(/\/$/, "");
    next();
});

//////////////////////////////////////////////
// Route specification
//////////////////////////////////////////////
app.get('/', (req, res) => {
    // A4. Render home.hbs
    res.render('home');
});

app.get('/about', (req, res) => {
    // A4. Render about.html
    res.render('about');
});

// A3. Append ../add routes
app.get('/employees/add', (req, res) => {
    res.render('addEmployee');
});

app.get('/images/add', (req, res) => {
    res.render('addImage');
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

// A3. Add /employees/value route
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

// 404 Error page
app.get('*', (req, res) => {
    res.status(404).send('404: page not found');
});

data_service.initialize()
 .then(() => {
     app.listen(HTTP_PORT, () => {
        console.log("Express http server listening on: " + HTTP_PORT);
     });
 })
 .catch((err) => {
     res.send(err);
 });