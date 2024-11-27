const mysql = require('mysql');

const mysqlConfig = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "example",
    port: "3306"
});

const mysqlConnect = () => {
    mysqlConfig.connect(function (err) {
        if (err) throw err;
        console.log("Mysql Connected!!!")
    });

}


module.exports = { mysqlConnect, mysqlConfig };

