const express = require('express')
const app = express()
const nodemailer = require('nodemailer')
const { home, home2, signin, adminpanel } = require("./controllers/router")
const bodyParser = require('body-parser')
const DatabaseConnection = require('./models/database')
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use('/public', express.static('public'))
app.use('/node_modules', express.static('node_modules'))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get("/", home)
app.get("/signin", signin)
app.get("/adminpanel", adminpanel)
app.get("/tr", home2)
app.post("/signin", (req, res, next) => {
    let username = req.body.username
    let password = req.body.password
    let email = req.body.email
    let formType = req.body.formType

    //     /* ======================== */
    //     /* ======================== */
    //     /* MYSQL */
    //     /* ======================== */
    //     /* ======================== */
    const dbConfigure = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'test_db',
        selectedTable: 'test_table'
    }

    const db = DatabaseConnection()

    db.create(dbConfigure)

    db.open().then(function (connection) {
        // console.log("veritabanına bağlanıldı!")
    }).catch(function (error) {
        if (error.code == "ECONNREFUSED") console.log("Veritabanına bağlanılamadı!")
    })

    if (formType == "login") {
        db.sql("SELECT * FROM test_table").then(function (result) { }).catch(function (error) {
            if (error) console.log(error)
        })

        res.end()
    } else if (formType == "register") {
        db.sql(`INSERT INTO ${dbConfigure.selectedTable} (username, password, email) VALUES ('${username}', '${password}', '${email}')`).then(function (data) {
            res.send(true)
            res.end()
        }).catch(function (error) {
            if (error.code == "ER_DUP_ENTRY") {
                // console.log("Böyle bir kullanıcı zaten var!")
                res.send(false)
                res.end()
            }
        })
    }
})

app.post("/", (req, res, next) => {
    res.end()
})

app.post("/", (req, res, next) => {
    /* ======================== */
    /* ======================== */
    /* NODEMAILER */
    /* ======================== */
    /* ======================== */
    const hostMail = "webdvpv@gmail.com"
    const service = "gmail"
    const password = "v01ka_-n"

    let name = req.body.name
    let surname = req.body.surname
    let email = req.body.email
    let subject = req.body.subject
    let message = req.body.message

    let transporter = nodemailer.createTransport({
        service,
        auth: {
            user: hostMail,
            pass: password
        }
    }, {
        // sender info
        from: email
    })

    let userInfos = {
        // Comma separated list of recipients
        to: hostMail,

        // Subject of the message
        subject: `${subject} - Director`,

        // HTML body
        html: `
        <p>
        ${name} ${surname} - ${email}<br><br>
        ${message}
        </p>
        `
    }

    transporter.sendMail(userInfos, (error, info) => {
        if (error) return process.exit(1)
        else {
            transporter.close()
            res.end()
        }
    })

})

app.listen(port, function () {
    console.log(`F*ckin' app listening at f*ckin' http://localhost:${port} f*cking port 🖕`)
})