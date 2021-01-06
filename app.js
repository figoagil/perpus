const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require ('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')
const bodyParser = require('body-parser')

//Load config
dotenv.config({ path: './config/config.env' })

//Passport config
require('./config/passport')(passport)
connectDB()
const app = express()

//Body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// override method
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))
//logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//handlebars helpers
const {formatDate, stripTags, truncate, select} = require('./helpers/hbs')

//hanldebars
app.engine('.hbs', exphbs({ helpers: {
  formatDate, stripTags, truncate, select
}, defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection})
  }))
//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/books', require('./routes/books'))


const PORT = process.env.PORT || 3000
app.listen(
    PORT, 
    console.log('Server running in '+ process.env.NODE_ENV+ ' mode on port '+ PORT)
    )
