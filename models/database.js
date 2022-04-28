var mysql = require('mysql')

function DatabaseConnection() {
    var pool

    function createInstance(dbConfigure) {
        pool = mysql.createPool({
            host: dbConfigure.host,
            user: dbConfigure.user,
            password: dbConfigure.password,
            database: dbConfigure.database
        }, {debug: true})
    }

    function init() {
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (error, connection) {
                if (!error) resolve(connection)
                else reject(error)
            })
        })
    }

    function query(sentence) {
        return new Promise(function (resolve, reject) {
            pool.query(sentence, function (error, results, fields) {
                if (!error) resolve(results)
                else reject(error)
            })
        })

        pool.release() // Connection bu kısımda 'Unreachable code detected.ts(7027)' uyarısı verse de çalışır.
    }

    return {
        create: createInstance,
        open: init,
        sql: query
    }
}

module.exports = DatabaseConnection