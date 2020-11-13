const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

const port = 3000 || process.env.PORT

app.use(cors())

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('./database/initial_database')

app.listen(port, () => {
    console.log(`Server is listening on ${port}`)
})