var express = require('express');
var fs = require('fs');
var app = express();
var Datastore = require('nedb');
var db = {};
var responder = require('./httpResponder');

// Connect to an NeDB database
db.movies = new Datastore({ filename: 'db/movies', autoload: true });

// Gzip compress content
app.use(express.compress());

// Serve static files (CSS, HTML, JS) in 'public' folder
app.use(express.static(__dirname + "/public"));

// Necessary for accessing POST data via req.body object
app.use(express.bodyParser());

// Catch-all route to set global values
app.use(function (req, res, next) {
    res.type('application/json');
    res.locals.respond = responder.setup(res);
    next();
});

// Point ROOT at our public index.html
app.get('/', function (req, res) {
    res.writeHead(302, {
        'Location': 'public/index.html'
    });
    res.end();
});

// API Routes
app.get('/api/movies', function(req, res) {
	db.movies.find({}, res.locals.respond);
});

app.post('/api/movies', function (req, res) {
	db.movies.insert({ title: req.body.title, rating: req.body.rating }, res.locals.respond);
});

app.get('/api/movies/:id', function(req, res) {
	db.movies.findOne({ _id: req.params.id }, res.locals.respond);
});

app.put('/api/movies/:id', function(req, res) {
	db.movies.update({ _id: req.params.id }, req.body, function(err, numUpdated) {
		res.locals.respond(err, req.body);
	});
});

app.delete('/api/movies/:id', function(req, res) {
	db.movies.remove({ _id: req.params.id }, res.locals.respond);
});

app.listen(process.argv[2] || 8080);