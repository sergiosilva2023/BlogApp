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
    require('./models/Postagem')
    const Postagem = mongoose.model('postagens')
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')

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
    app.get('/', (req, res)=>{
        Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens)=>{
            res.render('index', {postagens: postagens})
        }).catch((err) =>{
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/404')
        })
    })

    app.get('/categorias', (req, res)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render('categorias/index', {categorias: categorias})
        }).catch((err) =>{
            req.flash('error_msg', 'Houve um erro interno ao listar as categorias')
            res.redirect('/')
        })
    })

    app.get('/categorias/:slug', (req, res)=>{
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria)=>{
            if(categoria){

                Postagem.find({categoria: categoria._id}).lean().then((postagens) =>{
                    res.render('categorias/postagens', {postagens: postagens, categoria: categoria})
                }).catch((err)=>{
                    req.flash('error_msg', 'Houve um erro ao listar as publicações')
                    res.redirect('/')
                })
            } else {
                req.flash('error_msg', 'Esta categoria não existe')
                res.redirect('/')
            }
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno ao carregar a página desta categorias')
            res.redirect('/')
        })
    })

    app.get('/postagem/:slug', (req, res)=>{
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem)=>{
            if(postagem){
                res.render('postagem/index', {postagem: postagem})
            } else {
                req.flash('error_msg', 'Esta postagem não existe')
                res.redirect('/')
            }
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })
    })

    app.get('/404', (req, res)=>{
        res.send('Erro 404!')
    })

    app.use('/admin', admin)

// Outros
const PORT = 8081
app.listen(PORT,()=>{
    console.log("Servidor Ativo!")
})