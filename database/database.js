var sqlite3 = require('sqlite3').verbose()
const fs = require('fs')

const DBSOURCE = './database/airport.db'

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        return console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE Airport (
            Airport_Id INTEGER PRIMARY KEY,
            City TEXT NOT NULL,
            Code TEXT NOT NULL,
            Country TEXT NOT NULL
          )`,
        (err) => {
            if (err) {
                db.run(`DELETE FROM Airport`)
                insert()
            }
        })
        insert()
    }
})

function insert() {
    let rawData = fs.readFileSync('./database/airports.json')
    let airports = JSON.parse(rawData)

    for (let index = 0; index < airports.length; index++) {
        var city = airports[index].City
        var code = airports[index].Code
        var country = airports[index].Country

        db.run(`INSERT INTO Airport (City, Code, Country) VALUES (?, ?, ?)`, [city, code, country], function (err) {
            if (err) {
                return console.log(err.message);
            }
        });
    }
}

module.exports = db