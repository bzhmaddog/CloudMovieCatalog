var Hapi = require('hapi'),
	server = Hapi.createServer('0.0.0.0', 8001, { cors : true }),
	fs = require('fs'),
	Catalog = require('node-amc').Amc,
	catalog;
	

// Root route (just give so basic information about the  catalog
server.route({
  method: 'GET',
	path: '/',
	handler: function(request, reply) {
		var info = catalog.getCatalogInfo();
		
		reply(info).type('application/json');
	}
});

server.route({
  method: 'GET',
	path: '/list',
	handler: function(request, reply) {
		var movies = catalog.getMoviesLite();
		
		// return the data to client
		reply(movies).type('application/json');
	}
});

server.route({
  method: 'GET',
	path: '/movies',
	handler: function(request, reply) {
		var _data = [],
			movies = catalog.getAllMovies();
		
		// return the data to client
		reply(movies).type('application/json');
	}
});

server.route({
  method: 'GET',
	path: '/movie/{id}',
	handler: function(request, reply) {
		var response = {},
			movie,
			id;

		if (typeof request.params.id !== 'undefined') {
			id = parseInt(request.params.id);
		}
		
		if (!isNaN(id)) {
			
			movie = catalog.getMovieById(id);

			if (typeof movie.Number !== 'undefined') {
				response = movie;
			} else {
				response.statusCode = 404;
				response.error = 'Movie not found',
				response.message = 'The requested movie Id was not found in this catalog'
			}
		
		} else {
			response.statusCode = 404,
			response.error = 'Movie not found',
			response.message = 'The requested movie Id was not found in this catalog'
		}
		
		// return the data to client
		reply(response).type('application/json');
	}
});

server.route({
  method: 'POST',
	path: '/movie',
	handler: function(request, reply) {
		var response = {},
			movie,
			id;

		// return the data to client
		reply(response).type('application/json');
	}
});

catalog = new Catalog('../data/Sample_4.2.0.xml', function () {
	console.log(catalog.length());
	server.start();
});