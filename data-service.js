const fs = require('fs');

// Module data
var employees = [];
var departments = [];

module.exports.initialize = function() {

    return new Promise((resolve, reject) => {
        fs.readFile('./data/employees.json', (err, data) => {
            if (err) throw err;
            employees = JSON.parse(data);
        });
        fs.readFile('./data/departments.json', (err, data) => {
            if (err) throw err;
            departments = JSON.parse(data);
        });
        if (employees == null || departments == null)
            reject('unable to read file');
        else
            resolve();
    })
}

module.exports.getAllEmployees = function() {

    return new Promise((resolve, reject) => {
        if (employees.length == 0)
            reject('no result returned');
        else {
            resolve(employees);
        }
    })
}

module.exports.getManagers = function() {

    return new Promise((resolve, reject) => {
        var count = 0;
        var managers = [];
        for (var i in employees) {
            if (employees[i].isManager == true)
                managers[count++] = employees[i];
        }
        if (managers.length == 0)
            reject('no results returned');
        else {
            resolve(managers);
        }
    })
}

module.exports.getDepartments = function() {
    
    return new Promise((resolve, reject) => {
        if (departments.length == 0)
            reject('no result returned');
        else {
            resolve(departments);
        }
    })
}