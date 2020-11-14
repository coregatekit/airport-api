const router = require('express').Router()

var db = require('../../database/database')

router.get('/airports', (req, res, next) => {
    var sql = `SELECT * FROM Airport ORDER BY Code`
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({error: err.message})
            return
        }
        res.json(rows)
    })
})

router.get('/airports/:code', (req, res, next) => {
    var sql = `SELECT * FROM Airport WHERE Code = ?`
    var params = [req.params.code]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({error: err.message})
            return
        }
        res.json(row)
    })
})

router.get('/airports/findbycity/:city', (req, res, next) => {
    var sql = `SELECT * FROM Airport WHERE City = ?`
    var params = [req.params.city]
    db.all(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({error: err.message})
            return
        }
        res.json(row)
    })
})

router.get('/airports/findbycountry/:country', (req, res, next) => {
    var sql = `SELECT * FROM Airport WHERE Country = ?`
    var params = [req.params.country]
    db.all(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({error: err.message})
            return
        }
        res.json(row)
    })
})

module.exports = router