const express = require('express')
const app = express()
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config({path: './config/config.env'})
connectDB()

//dev env requests logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

//static folder
app.use(express.static('public'))

//get routes
app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on ${PORT}`))