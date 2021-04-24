const express = require('express')
const dotenv = require('dotenv')
const mongoose  = require('mongoose')
const passport = require('passport')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const connectDB = require('./config/db')
const session = require('express-session')
const  MongoStore = require('connect-mongo')

const path = require('path')


// load the config

dotenv.config({path:'./config/config.env'})

// passport config
require('./config/passport')(passport)
// connect
connectDB()

const app = express()
// body parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())
// method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// morgan
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

// handlebars helpers

const {formatDate,stripTags,select, truncate, editIcon } = require('./helpers/hbs')


// Handlebars
app.engine('.hbs',exphbs({helpers: {formatDate,select,stripTags,truncate, editIcon},defaultLayout:'main',extname:'.hbs'}))
app.set('view engine','.hbs')

// session
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
}))

// passpt middlawre
app.use(passport.initialize())
app.use(passport.session())

// set glbal var
app.use(function(req,res,next){
    res.locals.user = req.user || null
    next()

})

// static folder
app.use(express.static(path.join(__dirname,'public')))

// ROUTERS
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>console.log(`server runing in ${process.env.NODE_ENV} mode on port ${PORT}`))