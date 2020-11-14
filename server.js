var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var db = require('./database/database')

var app = express()

const port = 3000 || process.env.PORT

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./routes'))

const state = { isShutdown: false };

app.get('/api/status', (req, res) => {
    if (state.isShutdown) {
        res.status(500).json({ message: 'response not ok!' })
    }
    res.status(200).json({ message: 'response ok!' })
})

let server = app.listen(port, () => {
    console.log(`Server is listening on ${port}`)
})

// Graceful Shutdown

const gracefulShutdown = () => {
    state.isShutdown = true

    console.info('Got SIGTERM. Graceful shutdown start', new Date().toISOString())
    server.close(() => {
        console.log('Closed out remaining connections.')
        db.close()
        process.exit()
    })

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down')
        db.close()
        process.exit()
    }, 10 * 1000)
}

// listen for TERM signal .e.g kill
process.on('SIGTERM', gracefulShutdown)

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown)