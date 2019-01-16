const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")

router.get('/', (req,res)=>{
    res.render('admin/index')
});

//categoria

router.get('/categorias', (req,res)=>{
    Categoria.find().then((categorias)=>{
        res.render('admin/categorias',{categorias:categorias})
    }).catch(()=>{
        req.flash("error_msg","houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
});

router.get('/categorias/add', (req,res)=>{
    res.render('admin/addcategorias')
});

router.post('/categorias/store', (req,res)=>{
    var erros =[]
    
    if(!req.body.nome || typeof req.body.nome== undefined || req.body.nome == null)
    {
        erros.push({texto: "nome invalido"})
    }
    if(!req.body.slug || typeof req.body.slug== undefined || req.body.slug == null)
    {
        erros.push({texto: "slug invalido"})
    }

    if(erros.length>0)
    {
        res.render("admin/addcategorias",{erros: erros})

    }else{
        var novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg","Categoria criada com sucesso")
            res.redirect("/admin/categorias")

        }).catch((error)=>{
            req.flash("error_msg","houve um erro ao salvar a categoria")
            res.redirect("/admin")
        })
    }
});

router.get('/categorias/edit/:id', (req,res)=>{
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render('admin/editcategorias', {categoria:categoria})
    }).catch((error)=>{
        req.flash("error_msg","esta categoria não existe")
        res.redirect("/admin/categorias")
    })
});

router.post('/categorias/edit', (req,res)=>{
    var erros =[]
    
 
        Categoria.findOne({_id:req.body.id}).then((categoria)=>{

            if(!req.body.nome || typeof req.body.nome== undefined || req.body.nome == null)
            {
                erros.push({texto: "nome invalido"})
            }
            if(!req.body.slug || typeof req.body.slug== undefined || req.body.slug == null)
            {
                erros.push({texto: "slug invalido"})
            }
        
            if(erros.length>0)
            {
                res.render("admin/editcategorias",{categoria: categoria, erros: erros})
        
            }else{
                categoria.nome = req.body.nome
                categoria.slug = req.body.slug

                new Categoria(categoria).save().then(()=>{
                    req.flash("success_msg","Categoria editada com sucesso")
                    res.redirect("/admin/categorias")
                }).catch((error)=>{
                    req.flash("error_msg","houve um erro ao editar a categoria")
                    res.redirect("/admin/categorias")
                })
            }

        }).catch((error)=>{
            req.flash("error_msg","erro ao editar categoria")
            res.redirect("/admin/categorias")
        })

    
});
router.post('/categorias/remove', (req,res)=>{
        Categoria.remove({_id:req.body.id}).then((categoria)=>{
            req.flash("success_msg","Categoria deletada com sucesso")
            res.redirect("/admin/categorias")
        }).catch((error)=>{
            req.flash("error_msg","erro ao deletar categoria")
            res.redirect("/admin/categorias")
        })
});

//postagem
router.get('/postagens', (req,res)=>{

    Postagem.find().populate("categoria").then((postagens)=>{
        res.render('admin/postagens',{postagens:postagens})
    }).catch(()=>{
        req.flash("error_msg","houve um erro ao listar as postagens")
        res.redirect("/admin")
    })
});

router.get('/postagens/add', (req,res)=>{
    Categoria.find().then((categorias)=>{
        res.render('admin/addpostagens',{categorias:categorias})
    }).catch(()=>{
        req.flash("error_msg","houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
});

router.post('/postagens/store', (req,res)=>{
    var erros =[]
    
    if(!req.body.titulo || typeof req.body.titulo== undefined || req.body.titulo == null)
    {
        erros.push({texto: "titulo invalido"})
    }
    if(!req.body.slug || typeof req.body.slug== undefined || req.body.slug == null)
    {
        erros.push({texto: "slug invalido"})
    }
    if(!req.body.conteudo || typeof req.body.conteudo== undefined || req.body.conteudo == null)
    {
        erros.push({texto: "conteudo invalido"})
    }
    if(!req.body.descricao || typeof req.body.descricao== undefined || req.body.descricao == null)
    {
        erros.push({texto: "descricao invalido"})
    }
    if(req.body.categoria == "0")
    {
        erros.push({texto: "categoria invalido"})
    }

    if(erros.length>0)
    {
        res.render("admin/addpostagens",{erros: erros})

    }else{
        var novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            conteudo: req.body.conteudo,
            descricao: req.body.descricao,
            categoria: req.body.categoria,
            autor: req.body.slug
        }

        new Postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg","Postagem criada com sucesso")
            res.redirect("/admin/postagens")

        }).catch((error)=>{
            req.flash("error_msg","houve um erro ao salvar a postagem\n" + error)
            res.redirect("/admin")
        })
    }
});

module.exports = router;