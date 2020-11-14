const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser')

const app = express()

const port = 3000 || process.env.PORT

app.use(cors())

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('./database/initial_database')

const state = { isShutdown: false };

app.get('api/status', (req, res) => {
    if (state.isShutdown) {
        res.status(500).send('response not ok!')
    }
    res.status(200).send('response ok')
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
        fs.unlinkSync('./database/airport.db')
        process.exit()
    })

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down')
        process.exit()
    }, 10 * 1000)
}

// listen for TERM signal .e.g kill
process.on('SIGTERM', gracefulShutdown)

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown)