const routes = {
    home: (req, res, next) => {
        res.render('layout')
        res.end()
        next()
    },

    home2: (req, res, next) => {
        res.render('layout_tr')
        res.end()
        next()
    },

    signin: (req, res, next) => {
        res.render('signin')
        res.end()
        next()
    },

    adminpanel: (req, res, next) => {
        res.render('adminpanel')
        res.end()
        next()
    }
}

module.exports = routes