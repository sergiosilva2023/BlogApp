// Carregar módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')

// Configurações
    // Sessão
    app.use(session({secret: 'cursodenode', resave: true, saveUninitialized: true}))
    app.use(flash())
    // Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")  // variavel global
        res.locals.error_msg = req.flash("error_msg")  // variavel global
        next()
    })
    // Body Parser
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())
    // Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    // Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://localhost/blogapp').then(()=>{
            console.log('Conexão mongoDB com sucesso!')
        }).catch((err)=>{
            console.log('Erro de conexão!!!'+err)
        })
    // Public (arquivos estaticos)
    app.use(express.static(path.join(__dirname, 'public')))

    // Middleware
    // é configurado nos params da app.use 
       /*app.use((req, res, next)=>{
            console.log('Oi, eu sou um Middleware!')
            next()
        })*/


// Rotas
    app.use('/admin', admin)

// Outros
const PORT = 8081
app.listen(PORT,()=>{
    console.log("Servidor Ativo!")
})