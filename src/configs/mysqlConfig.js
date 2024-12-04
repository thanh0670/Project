const mysqlConfig = {
    DB: "example",
    USER: "Thanh",
    PASSWORD: "2Y5IQ2IC",
    HOST: "localhost",
    DIALECT: "mysql",
    POOL: {
        max: 5,
        min: 0,
        accquire: 30000,
        idle: 10000
    }
}

module.exports = { mysqlConfig }