var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var Tag = require('../shared/tag.js');
var Bookmark = require('../shared/annuaire.js');
var less = require('less');

var app = module.exports = express();

/**
 * Définition de ressources statiques dans le dossier public
 */
app.use(express.static(__dirname + path.sep + '../public'));
//app.use('public/js/bootstrap.js', express.static(__dirname + '/node_modules/bootstrap/dist/js/bootstrap.js')); // redirect bootstrap JS
/*app.use(__dirname + path.sep + '../public/js', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
*/
app.use('/jquery',  express.static( path.join(__dirname, '../node_modules/jquery/dist')));
app.use('/bootstrap-js',  express.static( path.join(__dirname, '../node_modules/bootstrap/dist/js')));
app.use('/bootstrap-css',  express.static( path.join(__dirname, '../node_modules/bootstrap/dist/css')));
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/* Controller */


app.get('/', function(req, res){

    res.sendFile(path.resolve('public/index.html'));
});

app.get('/tag.js', function(req, res) {
    res.sendFile(path.resolve('shared/tag.js'));

});

/* CRUD methodes */

/**
 * Retourne la entité de un link selon l'identificateur envoyé.
 * 404 si l'identificateur ne correspond pas à aucun link
 */
app.get('/bookmarks/:id', function (req, res) {
    var site = Bookmark.get(req.params.id);

    if (!Object.keys(link).length) {
        res.status(404).send();
    } else {
        res.status(200).send(JSON.stringify(site));
    }
});

/**
 * Retourne tous les links de l'Bookmark
 */
app.get('/bookmarks/', function (req, res) {
    var all_bookmarks = Bookmark.collection;
    var collection = [];

    for (var key in all_bookmarks) {
        if (all_bookmarks.hasOwnProperty(key))
            collection.push({title: key, url: all_bookmarks[key].value,
                tags: all_bookmarks[key].tags.collection.join(',')});
    }

    res.status(200).send(JSON.stringify(collection));
});

/**
 * Cette méthode crée un nouveau link
 */
app.post('/bookmarks/', urlencodedParser, function (req, res) {
    try {
        var model = JSON.parse(req.body.model);
        var url = model.url;
        var nom = model.title;
        var tags = model.tags;

        var tag = new Tag();
        tags.split(',').forEach(function (e) {
            tag.add(e);
        });

        Bookmark.bind(nom, url, tag);
        res.status(201).send(JSON.stringify(Bookmark.get(nom)));
    }catch (e){
        res.status(500).send(e.message);
    }
});

/**
 * Cette méthode supprime un link
 */
app.delete('/bookmarks/:id', function (req, res) {
    Bookmark.remove(req.params.id);
    res.status(204).send();
});

