var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = module.exports = express();
app.use(express.static(__dirname + path.sep + '../public'));

var urlencodedParser = bodyParser.urlencoded({ extended: false });

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

var global = new Annuaire();

app.get('/', function(req, res){
    res.sendFile(path.resolve('public/client.html'));
});

app.get('/annuaire.js', function(req, res) {
    res.sendFile(path.resolve('modele/annuaire.js'));
});

/* CRUD methodes */

app.get('/get/:id', function (req, res) {
    var link = global.get(req.params.id);

    if (!Object.keys(link).length) {
        res.status(404).send();
    } else {
        res.status(200).send(JSON.stringify(link));
    }
});

app.get('/all', function (req, res) {
    var collection = global.collection;
    var annuarie = [];

    for (var key in global.collection) {
        annuarie.push({nom: key, url: collection[key]});
    }

    res.status(200).send(JSON.stringify(annuarie));
});

app.post('/', urlencodedParser, function (req, res) {
    var url = req.body.url;
    var nom = req.body.nom;

    global.bind(nom, url);
    res.status(201).send(JSON.stringify(global.get(nom)));
});

app.delete('/:id', function (req, res) {
    global.remove(req.params.id);
    res.status(204).send();
});

/*
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Serveur en écoutant dans http://%s:%s ...", host, port)
});*/