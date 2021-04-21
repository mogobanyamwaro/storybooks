const express = require('express')
const dotenv = require('dotenv')
const mongoose  = require('mongoose')
const passport = require('passport')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
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

// morgan
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

// Handlebars
app.engine('.hbs',exphbs({defaultLayout:'main',extname:'.hbs'}))
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

// static folder
app.use(express.static(path.join(__dirname,'public')))

// ROUTERS
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>console.log(`server runing in ${process.env.NODE_ENV} mode on port ${PORT}`))