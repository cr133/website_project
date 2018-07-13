const Sequelize = require('sequelize');

// censored
var sequelize = new Sequelize('d9o2101qmk6t5l', 'jefburvdbajbxo', '95e55dc42a7d4055641852e482104d0963afa5143ddf3afaa3e76f385b27dfbb', {
    host: 'ec2-54-235-244-185.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: { ssl: true }
});

// Employee table
var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName:          Sequelize.STRING,
    lastName:           Sequelize.STRING,
    email:              Sequelize.STRING,
    SSN:                Sequelize.STRING,
    addressStreet:      Sequelize.STRING,
    addressCity:        Sequelize.STRING,
    addressState:       Sequelize.STRING,
    addressPostal:      Sequelize.STRING,
    maritalStatus:      Sequelize.STRING,
    isManager:          Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status:             Sequelize.STRING,
    department:         Sequelize.INTEGER,
    hireDate:           Sequelize.STRING,
});

// Department table
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
})

module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        sequelize.sync()
         .then(() => { resolve(); })
         .catch(() => { reject('unable to sync the database'); });
    })
}

//////////////////////////////////////////////
// employee
//////////////////////////////////////////////
module.exports.getAllEmployees = function() {
    return new Promise((resolve, reject) => {
        Employee.findAll()
         .then((data) => { resolve(data); })
         .catch(() => { reject('no results returned'); });
    })
}

module.exports.addEmployee = function(empData) {
    return new Promise((resolve, reject) => {
        empData.isManager = (empData.isManager) ? true : false;
        for (let prop in empData) {
            if (empData[prop] == "")
                empData[prop] = null;
        }
        Employee.create(empData)
         .then(() => { resolve(); })
         .catch(() => { reject('unable to create department'); });
    })
}

module.exports.updateEmployee = function(empData) {
    return new Promise((resolve, reject) => {
        empData.isManager = (empData.isManager) ? true : false;
        for (let prop in empData) {
            if (prop.value == "")
                prop.value = null;
        }

        Employee.update(empData, {
            where: { employeeNum: empData.employeeNum }
        })
         .then((data) => { resolve(data); })
         .catch(() => { reject('unable to update employee')});
    })
}

module.exports.getEmployeesByStatus = function(status) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: { 
                status: status // will they be distinguished?
            }
        })
         .then((data) => { resolve(data); })
         .catch(() => { reject('no results returned'); });
    })
}

module.exports.getEmployeesByDepartment = function(department) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: { 
                department: department
            }
        })
         .then((data) => { resolve(data); })
         .catch(() => { reject('no results returned'); });
    })
}

module.exports.getEmployeesByManager = function(manager) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: { 
                employeeManagerNum: manager
            }
        })
         .then((data) => { resolve(data); })
         .catch(() => { reject('no results returned'); });
    })
}

module.exports.getEmployeeByNum = function(num) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: { 
                employeeNum: num
            }
        })
         .then((data) => { resolve(data); })
         .catch(() => { reject('no results returned'); });
    })
}

//////////////////////////////////////////////
// department
//////////////////////////////////////////////
module.exports.getDepartments = function() {
    return new Promise((resolve, reject) => {
        Department.findAll()
         .then((data) => { resolve(data); })
         .catch(() => { reject('no results returned'); });
    })
}

module.exports.addDepartment = function(depData) {
    return new Promise((resolve, reject) => {
            for (let prop in depData) {
                if (depData[prop] == "")
                    depData[prop] = null;
            }
            Department.create(depData)
             .then(() => { resolve(); })
             .catch(() => { reject('unable to create department'); });
    })
}

module.exports.updateDepartment = function(depData) {
    return new Promise((resolve, reject) => {
        for (let prop in depData) {
            if (prop == "")
                prop = null;
        }

        Department.update(depData, {
            where: { departmentId: depData.departmentId }
        })
         .then((data) => { resolve(data); })
         .catch(() => { reject('unable to update department'); });
    })
}

module.exports.getDepartmentById = function(id) {
    return new Promise((resolve, reject) => {
        Department.findAll({
            where: { 
                departmentId: id
            }
        })
         .then((data) => { resolve(data); })
         .catch(() => { reject('no results returned'); });
    })
}

// A5. Delete Emp
module.exports.deleteEmployeeByNum = function(num) {
    return new Promise((resolve, reject) => {
        Employee.destroy({
            where: {
                employeeNum: num
            }
        })
         .then(() => { resolve(); })
         .catch(() => { reject('unable to remove employee'); })
    })
}