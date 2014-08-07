var Hapi = require('hapi'),
	server = Hapi.createServer('0.0.0.0', 8001, { cors : true }),
	fs = require('fs'),
	DOMParser = require('xmldom').DOMParser,
	xpath = require('xpath'),
	doc,
	root,
	catalog,
	contents;

	function getMovieFromNode(xmlNode) {
		// basic movie object
		var movie = {
			CustomFields : {},
			Extras : []
			},
			j,
			k;
			
		// get attributes / custom field / extras
		attributes = xmlNode.attributes;
		customFields = xmlNode.getElementsByTagName('CustomFields');
		extras = xmlNode.getElementsByTagName('Extras');
		
		// map attributes to json properties
		for (j = 0 ; j < attributes.length ; j++) {
			movie[attributes[j].name] = attributes[j].value;
		}

		// if there is custom fields then
		if (customFields.length > 0) {
			attributes = customFields[0].attributes;

			// map attributes to object properties
			for (j = 0 ; j < attributes.length ; j++) {
				movie.CustomFields[attributes[j].name] = attributes[j].value;
			}
		}

		// if the Extras node is there then parse it for extras
		if (extras.length > 0) {
			extras = extras[0].getElementsByTagName('Extra');
			
			// if there is at least one 'Extra' Node in the 'Extras' node
			if (extras.length > 0) {
			
				// parse all 'Extra' nodes for this movie
				for (k = 0 ; k < extras.length ; k++) {
					extra = {};
					attributes = extras[k].attributes;

					// map attributes to object properties
					for (j = 0 ; j < attributes.length ; j++) {
						extra[attributes[j].name] = attributes[j].value;
					}

					// add extra to the movie object
					movie.Extras.push(extra);
				}
			}
		}
		
		// return movie object
		return movie;
	}
	
	function getMovieFromNodeLite(xmlNode) {
		// basic movie object
		return {
			Number : xmlNode.getAttribute('Number'),
			FormattedTitle : xmlNode.getAttribute('FormattedTitle'),
			OriginalTitle : xmlNode.getAttribute('OriginalTitle')
		};
	}	
	
// Root route (just give so basic information about the  catalog
server.route({
  method: 'GET',
	path: '/',
	handler: function(request, reply) {
		var properties = catalog.getElementsByTagName('Properties')[0],
			customFieldsProperties = catalog.getElementsByTagName('CustomFieldsProperties'),
			customFields,
			field,
			_data = {			
				version : root.getAttribute('Version'),
				format : root.getAttribute('Format'),
				date : root.getAttribute('Date'),
				owner : {
					name : properties.getAttribute('Owner'),
					email : properties.getAttribute('Mail'),
					url : properties.getAttribute('Site'),
					description : properties.getAttribute('Description')
				},
				CustomFieldsProperties : [],
				movies : contents.getElementsByTagName('Movie').length
			};

		//console.log(customFieldsProperties[0]);
			
		if (customFieldsProperties.length > 0) {

			//customfields = customFieldsProperties[0];

			customFields = customFieldsProperties[0].getAttribute('ColumnSettings').split(',');
			
			for (i = 0 ; i < customFields.length ; i++) {
				if (customFields[i] !== '') {
					field = customFields[i].split(':');
					//_data.CustomFieldsProperties[field[0]] = field;
					_data.CustomFieldsProperties.push(field[0]);
				}
			}
		}
			
		reply({
			statusCode : 200,
			data : _data
		})
		.type('application/json');
	}
});

server.route({
  method: 'GET',
	path: '/list',
	handler: function(request, reply) {
		var _data = [],
			movies = contents.getElementsByTagName('Movie'),
			movie,
			attributes,
			customFields,
			extras,
			extra,
			i;
		
		// for all movies
		for (i = 0 ; i < movies.length ; i++) {
			// Get movie data from the node
			movie = getMovieFromNodeLite(movies[i]);
			
			// Add movie to array
			_data.push(movie);
		}
		
		// return the data to client
		reply(_data).type('application/json');
	}
});

server.route({
  method: 'GET',
	path: '/movies',
	handler: function(request, reply) {
		var _data = [],
			movies = contents.getElementsByTagName('Movie'),
			movie,
			attributes,
			customFields,
			extras,
			extra,
			i;
		
		// for all movies
		for (i = 0 ; i < movies.length ; i++) {
			// Get movie data from the node
			movie = getMovieFromNode(movies[i]);
			
			// Add movie to array
			_data.push(movie);
		}
		
		// return the data to client
		reply({
			statusCode : 200,
			data : _data
		})
		.type('application/json');
	}
});

server.route({
  method: 'GET',
	path: '/movie/{id}',
	handler: function(request, reply) {
		var xpathStr = '//Movie[@Number="{id}"]',
			response = {},
			xmlNodeMovie,
			movie,
			id;

		if (typeof request.params.id !== 'undefined') {
			id = parseInt(request.params.id);
		}
		
		if (!isNaN(id)) {
			
			xmlNodeMovie = xpath.select(xpathStr.replace('{id}',id), root);

			if (xmlNodeMovie.length >0) {
				movie = getMovieFromNode(xmlNodeMovie[0]);
				response.statusCode = 200;
				response.data = movie;
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
		reply(response)
		.type('application/json');
	}
});

fs.readFile('../data/Sample_4.2.0.xml', function (err, data) {
	if (err) throw err;

	doc = new DOMParser().parseFromString(data.toString('utf-8'), 'text/xml');
	root = doc.documentElement;
	catalog = root.getElementsByTagName('Catalog')[0],
	contents = catalog.getElementsByTagName('Contents')[0];

	//var test = xpath.select('//Movie[@Number="1"]', root);
	//console.log(getMovieFromNode(test[0]));
	
	server.start();
});


//server.start();

