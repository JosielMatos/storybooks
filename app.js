const express = require('express')
const app = express()
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const mongoose = require('mongoose')

//config
dotenv.config({path: './config/config.env'})
require('./config/passport')(passport)
connectDB()

//dev env requests logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//static folder
app.use(express.static('public'))

//get routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on ${PORT}`))