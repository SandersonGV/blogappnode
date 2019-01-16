const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const app = express()
const session = require('express-session')
const flash = require('connect-flash')

//configs
    //session
    app.use(session({
        secret: "goblinSession",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())
    // Middleware
    app.use((req,res,next)=>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })
    //bodyParser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())

    //handlebars
    app.engine("handlebars",handlebars({defaultLayout:'main'}))
    app.set('view engine','handlebars')

    //mongoose
    mongoose.Promise = global.Promise
    mongoose.connect("mongodb://localhost/blogapp", { useNewUrlParser: true }).then(()=>{
        console.log("db up")
    }).catch((error)=>{
        console.log("db down: "+error)
    })
    
    //public
    app.use(express.static(path.join(__dirname,"public")))

//rotas
app.use('/admin',admin)

//outros
const PORT = 8081
app.listen(PORT,()=>{
    console.log('server up!')
})