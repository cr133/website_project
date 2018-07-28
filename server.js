/****************************************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Cheolryeong Lee Student ID: 119862175 Date: 12. 07. 18
*
*  Online (Heroku) Link: https://web322a5.herokuapp.com/
*
*****************************************************************************************************/ 
var express = require('express');
var app = express();
var path = require('path');
var data_service = require('./data-service');
var data_service_auth = require('./data-service-auth');
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
// var querystring = require('querystring');
// A4. Add "express-handlebars"
var exphbs = require('express-handlebars');
// A6. Add client-sessions
var clientSessions = require('client-sessions');
var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

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

// A6. Setup client-sessions
app.use(clientSessions({
    cookieName: "session",
    secret: "web322assn06",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60
}))
// 4-4 - session or sessionName?
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
})

ensureLogin = (req, res, next) => {
    if (!req.session.user)
        res.redirect('/login');
    else
        next();
}

//////////////////////////////////////////////
// Route specification
//////////////////////////////////////////////
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});
//////////////////////////////////////////////
// images
//////////////////////////////////////////////
app.get('/images', ensureLogin, (req, res) => {
    fs.readdir('./public/images/uploaded/', (err, items) => {
        res.render('images', {
            data: items
        })
    });
});

app.get('/images/add', ensureLogin, (req, res) => {
    res.render('addImage');
});

app.post('/images/add', ensureLogin, upload.single('imageFile'), (req, res) => {
    res.redirect('/images');
});

//////////////////////////////////////////////
// employees
//////////////////////////////////////////////
app.get('/employees', ensureLogin, (req, res) => {
    if (Object.keys(req.query) == 'status') {
        data_service.getEmployeesByStatus(req.query.status)
         .then((data) => {
            if (data.length > 0)
                res.render('employees', { employees: data });
            else
                res.render('employees', { message: 'no results'});
         })
         .catch((err) => {
            res.render('employees', {message: err});
         })
    }
    else if (Object.keys(req.query) == 'department') {
        data_service.getEmployeesByDepartment(req.query.department)
         .then((data) => {
            if (data.length > 0)
                res.render('employees', { employees: data });
            else
                res.render('employees', { message: 'no results'});
         })
         .catch((err) => {
            res.render('employees', {message: err});
         })
    }
    else if (Object.keys(req.query) == 'manager') {
        data_service.getEmployeesByManager(req.query.manager)
         .then((data) => {
            if (data.length > 0)
                res.render('employees', { employees: data });
            else
                res.render('employees', { message: 'no results'});
         })
         .catch((err) => {
            res.render('employees', {message: err});
         })
    }
    else {
        data_service.getAllEmployees()
         .then((data) => {
            if (data.length > 0)
                res.render('employees', { employees: data });
            else
                res.render('employees', { message: 'no results'});
         })
         .catch((err) => {
            res.render('employees', {message: err});
         })
    }
});

app.get('/employees/add', ensureLogin, (req, res) => {
    data_service.getDepartments()
     .then((data) => {
        res.render('addEmployee', { departments: data });
     })
     .catch(() => {
         res.render('addEmployee', { departments: [] });
     })
});

app.post('/employees/add', ensureLogin, (req, res) => {
    data_service.addEmployee(req.body)
     .then(() => {
        res.redirect('/employees');
     })
     .catch(() => {
         res.status(500).send('Unable to Add Employee')
     })
});

app.post('/employees/update', ensureLogin, (req, res) => {
    data_service.updateEmployee(req.body)
     .then(() => {
        res.redirect('/employees');
     })
     .catch(() => {
        res.status(500).send('Unable to Update Employee')
    })
});

app.param('num', (req, res, next) => { next(); });
app.get('/employees/:num/', ensureLogin, (req, res) => {

    let viewData = {};

    data_service.getEmployeeByNum(req.params.num)
     .then((data) => {
         if (data)
            viewData.employee = data;
         else
            viewData.employee = null;
     })
     .catch(() => {
         viewData.employee = null;
     }).then(data_service.getDepartments)
     .then((data) => {
         viewData.departments = data;

         for (let i = 0; i < viewData.departments.length; i++) {
             if (viewData.departments[i].departmentId == viewData.employee.department)
                viewData.departments[i].selected = true;
         }
     })
     .catch(() => {
         viewData.departments = [];
     }).then(() => {
         if (viewData.employee == null)
            res.status(404).send('Employee Not Found');
         else {
             res.render('employee', { viewData: viewData });
         }
     });
});

// A5. delete emp
app.get('/employees/delete/:num', ensureLogin, (req, res) => {
    data_service.deleteEmployeeByNum(req.params.num)
     .then(() => {
         res.redirect('/employees');
     })
     .catch(() => {
         res.status(500).send('Unable to Remove Employee');
     })
})

//////////////////////////////////////////////
// departments
//////////////////////////////////////////////
app.get('/departments', ensureLogin, (req, res) => {
    data_service.getDepartments()
     .then((data) => {
         res.render('departments', { departments: data });
     })
     .catch((err) => {
        res.render('departments', {message: err});
     })
});

app.get('/departments/add', ensureLogin, (req, res) => {
    res.render('addDepartment');
})

app.post('/departments/add', ensureLogin, (req, res) => {
    data_service.addDepartment(req.body)
     .then(() => {
         res.redirect('/departments');
     })
     .catch(() => {
        res.status(500).send('Unable to Add Department')
    })
})

// TEMP: instruction: department me: departments
app.post('/departments/update', ensureLogin, (req, res) => {
    data_service.updateDepartment(req.body)
     .then(() => {
         res.redirect('/departments');
     })
     .catch(() => {
        res.status(500).send('Unable to Update Department')
    })
})

app.param('id', (req, res, next) => { next(); });
app.get('/departments/:id/', ensureLogin, (req, res) => {
    data_service.getDepartmentById(req.params.id)
     .then((data) => {
         if (data == undefined)
            res.status(404).send('Department Not Found');
         res.render('department', { department: data });
     })
     .catch((err) => {
        res.status(404).send('Department Not Found');
     })
});

//////////////////////////////////////////////
// A6. Client Session
//////////////////////////////////////////////
app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', (req, res) => {
    data_service_auth.registerUser(req.body)
     .then(() => {
         res.render('register', {successMessage: 'User created'});
     })
     .catch((err) => {
         res.render('register', {errorMessage: err, userName: req.body.userName});
     })
})

app.post('/login', (req, res) => {
    // check the name of get parameter
    req.body.userAgent = req.get('User-Agent');
    data_service_auth.checkUser(req.body)
     .then((user) => { 
         req.session.user = {
             userName: user[0].userName,
             email: user[0].email,
             loginHistory: user[0].loginHistory
         }

         res.redirect('/employees');
     })
     .catch((err) => {
         res.render('login', {errorMessage: err, userName: req.body.userName});
     })
})

app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
})

app.get('/userHistory', ensureLogin, (req, res) => {
    res.render('userHistory');
})

// 404 Error page
app.get('*', (req, res) => {
    res.status(404).send('404: page not found');
});

data_service.initialize()
 .then(data_service_auth.initialize)
 .then(() => {
     app.listen(HTTP_PORT, () => {
        console.log('Express http server listening on: ' + HTTP_PORT);
     });
 })
 .catch((err) => {
     res.send(err);
 });