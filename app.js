const express = require('express')
const app = express()
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

//config
dotenv.config({path: './config/config.env'})
require('./config/passport')(passport)
connectDB()

//dev env requests logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//static folder
app.use(express.static('public'))

//get routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on ${PORT}`))