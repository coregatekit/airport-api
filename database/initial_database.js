const fs = require('fs')
const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('./database/airport.db', uri = true, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.')
})

db.serialize(function () {
    let rawData = fs.readFileSync('./database/airports.json')
    let airports = JSON.parse(rawData)

    initial_airport(airports)
})

db.close();

function initial_airport(airports) {
    let sql_airport = `
    CREATE TABLE Airport (
      Airport_Id INTEGER PRIMARY KEY,
      City TEXT NOT NULL,
      Code TEXT NOT NULL,
      Country TEXT NOT NULL
    )`
    db.run(sql_airport)

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