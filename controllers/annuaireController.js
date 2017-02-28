var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var Tag = require('../shared/tag.js');
var annuaire = require('../shared/annuaire.js');

var app = module.exports = express();

/**
 * Définition de resources statiques dans le dossier public
 */
app.use(express.static(__dirname + path.sep + '../public'));
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/* Controller */


app.get('/', function(req, res){
    res.sendFile(path.resolve('public/index.html'));
});

app.get('/annuaire.js', function(req, res) {
    res.sendFile(path.resolve('shared/annuaire.js'));
});

app.get('/tag.js', function(req, res) {
    res.sendFile(path.resolve('shared/tag.js'));
});

/* CRUD methodes */

/**
 * Retourne la entité de un link selon l'identificateur envoyé.
 * 404 si l'identificateur ne correspond pas à aucun link
 */
app.get('/get/:id', function (req, res) {
    var site = annuaire.get(req.params.id);

    if (!Object.keys(link).length) {
        res.status(404).send();
    } else {
        res.status(200).send(JSON.stringify(site));
    }
});

/**
 * Retourne tous les links de l'annuaire
 */
app.get('/all', function (req, res) {
    var all_bookmarks = annuaire.collection;
    var collection = [];

    for (var key in all_bookmarks) {
        if (all_bookmarks.hasOwnProperty(key))
            collection.push({nom: key, url: all_bookmarks[key]});
    }

    res.status(200).send(JSON.stringify(collection));
});

/**
 * Cette méthode crée un nouveau link
 */
app.post('/', urlencodedParser, function (req, res) {
    try {
        var url = req.body.url;
        var nom = req.body.nom;
        var tags = req.body.tag;

        var tag = new Tag();
        tags.split(',').forEach(function (e) {
            tag.add(e);
        });

        annuaire.bind(nom, url, tag);
        res.status(201).send(JSON.stringify(annuaire.get(nom)));
    }catch (e){
        res.status(500).send(e.message);
    }
});

/**
 * Cette méthode supprime un link
 */
app.delete('/:id', function (req, res) {
    annuaire.remove(req.params.id);
    res.status(204).send();
});



/*
Pour les test
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Serveur en écoutant dans http://%s:%s ...", host, port)
});*/