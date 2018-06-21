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

// A3. addEmployee()
module.exports.addEmployee = function(empData) {

    return new Promise((resolve, reject) => {
        if (empData.isManager == undefined)
            empData.isManager = false;
        else
            empData.isManager = true;

        empData.employeeNum = employees.length + 1;
        employees[employees.length] = empData;
        resolve(employees);
    })
}

// A4. updateEmployee()
module.exports.updateEmployee = function(updtEmp) {
    return new Promise((resolve, reject) => {
        for (var i in employees) {
            if (employees[i].employeeNum == updtEmp.employeeNum) {
                employees[i] = updtEmp;
                break;
            }
        }
        resolve();
    })
}

// A3. employees?status
module.exports.getEmployeesByStatus = function(status) {

    return new Promise((resolve, reject) => {
        var count = 0;
        var empStatus = [];
        for (var i in employees) {
            if (employees[i].status == status)
                empStatus[count++] = employees[i];
        }
        if (empStatus.length == 0)
            reject('no results returned');
        else {
            resolve(empStatus);
        }
    })
}

// A3. employees?department
module.exports.getEmployeesByDepartment = function(department) {

    return new Promise((resolve, reject) => {
        var count = 0;
        var empDept = [];
        for (var i in employees) {
            if (employees[i].department == department)
                empDept[count++] = employees[i];
        }
        if (empDept.length == 0)
            reject('no results returned');
        else {
            resolve(empDept);
        }
    })
}

// A3. employees?manager
module.exports.getEmployeesByManager = function(manager) {

    return new Promise((resolve, reject) => {
        var count = 0;
        var empMan = [];
        for (var i in employees) {
            if (employees[i].employeeManagerNum == manager)
                empMan[count++] = employees[i];
        }
        if (empMan.length == 0)
            reject('no results returned');
        else {
            resolve(empMan);
        }
    })
}

// A3. getEmployeeByNum(num)
module.exports.getEmployeeByNum = function(num) {
    return new Promise((resolve, reject) => {
        var emp = [];
        for (var i in employees) {
            if (employees[i].employeeNum == num)
                emp[0] = employees[i];
        }
        if (emp.length == 0)
            reject('no result returned');
        else   
            resolve(emp[0]);

    })
}