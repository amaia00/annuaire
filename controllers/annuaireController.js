var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = module.exports = express();

/**
 * Définition de resources statiques dans le dossier public
 */
app.use(express.static(__dirname + path.sep + '../public'));
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/*
* Modèle
*/
var Annuaire = function() {
    this.collection = {};
};

Annuaire.prototype.get = function(key) {
    var object = {};
    var value = this.collection[key];

    if (typeof value!= 'undefined') {
        object.nom = key;
        object.url = this.collection[key];
    }

    return object;
};

Annuaire.prototype.bind = function(key, value) {
    try {
        this.collection[key] = value;
        return true;
    } catch(e) {
        console.trace(e);
        return false;
    }
};

Annuaire.prototype.remove = function(key) {
    delete this.collection[key];
};

/* Controller */

var global = new Annuaire();

app.get('/', function(req, res){
    res.sendFile(path.resolve('public/index.html'));
});

app.get('/annuaire.js', function(req, res) {
    res.sendFile(path.resolve('modele/annuaire.js'));
});

/* CRUD methodes */

/**
 * Retourne la entité de un link selon l'identificateur envoyé.
 * 404 si l'identificateur ne correspond pas à aucun link
 */
app.get('/get/:id', function (req, res) {
    var link = global.get(req.params.id);

    if (!Object.keys(link).length) {
        res.status(404).send();
    } else {
        res.status(200).send(JSON.stringify(link));
    }
});

/**
 * Retourne tous les links de l'annuaire
 */
app.get('/all', function (req, res) {
    var collection = global.collection;
    var annuarie = [];

    for (var key in global.collection) {
        annuarie.push({nom: key, url: collection[key]});
    }

    res.status(200).send(JSON.stringify(annuarie));
});

/**
 * Cette méthode crée un nouveau link
 */
app.post('/', urlencodedParser, function (req, res) {
    var url = req.body.url;
    var nom = req.body.nom;

    global.bind(nom, url);
    res.status(201).send(JSON.stringify(global.get(nom)));
});

/**
 * Cette méthode supprime un link
 */
app.delete('/:id', function (req, res) {
    global.remove(req.params.id);
    res.status(204).send();
});

/*
Pour les test
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Serveur en écoutant dans http://%s:%s ...", host, port)
});*/