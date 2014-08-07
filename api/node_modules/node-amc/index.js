var fs = require('fs'),
	DOMParser = require('xmldom').DOMParser,
	xpath = require('xpath');


/**
 * Helper method to parse a movie node into a Javascript object
 * @param xmlNode {DOMXMLNode} the movie node to be parsed
 * @return {object} a 'lite' movie object
 */
function getMovieFromNodeLite(xmlNode) {
	// basic movie object
	return {
		Number : xmlNode.getAttribute('Number'),
		FormattedTitle : xmlNode.getAttribute('FormattedTitle'),
		OriginalTitle : xmlNode.getAttribute('OriginalTitle')
	};
}	
	
/**
 * Helper method to parse a movie node into a Javascript object
 * @param xmlNode {DOMXMLNode} the movie node to be parsed
 * @return {object} a movie object
 */
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
	
/**
 * Constructor
 * @param file {string} filename of the catalog to open
 * @param callback {function} callback function to be called after file is loaded
 */
function Amc(file, callback) {
	this.doc = undefined;
	this.root = undefined;
	this.catalog = undefined;
	this.contents = undefined;

	// if filename is provided then load the given file
	if (typeof file !== 'undefined' && file !== '') {
		this.loadFromFile(file, callback);
	}
}

/**
 * Load XML catalog into memory
 * @param file {string} filename to open
 * @param callback {function} callback func to be called after file is opened/read
 */
Amc.prototype.loadFromFile = function (file, callback) {
	var that = this;

	fs.readFile(file, function (err, data) {
		if (err) throw err;

		that.doc = new DOMParser().parseFromString(data.toString('utf-8'), 'text/xml');
		that.root = that.doc.documentElement;
		that.catalog = that.root.getElementsByTagName('Catalog')[0],
		that.contents = that.catalog.getElementsByTagName('Contents')[0];
		that.properties = that.catalog.getElementsByTagName('Properties')[0];
		that.customFieldsProperties = that.catalog.getElementsByTagName('CustomFieldsProperties');
		
		if (typeof callback === 'function') {
			callback.call();
		}
	});
}

/**
 * Get informations about the current catalog
 * @return {object} an object with some information about the catalog
 */
Amc.prototype.getCatalogInfo = function () {
	var customFields,
		field,
		info;

	if (this.doc === undefined) {
		return {
			version : '',
			format : '',
			date : '',
			owner : {
				name : '',
				email : '',
				url : '',
				description : ''
			},
			CustomFieldsProperties : [],
			movies : 0
		}
	}

	info = {
		version : this.root.getAttribute('Version'),
		format : this.root.getAttribute('Format'),
		date : this.root.getAttribute('Date'),
		owner : {
			name : this.properties.getAttribute('Owner'),
			email : this.properties.getAttribute('Mail'),
			url : this.properties.getAttribute('Site'),
			description : this.properties.getAttribute('Description')
		},
		CustomFieldsProperties : [],
		movies : this.contents.getElementsByTagName('Movie').length
	};

	if (this.customFieldsProperties.length > 0) {

		customFields = this.customFieldsProperties[0].getAttribute('ColumnSettings').split(',');
		
		for (i = 0 ; i < customFields.length ; i++) {
			if (customFields[i] !== '') {
				field = customFields[i].split(':');
				//_data.CustomFieldsProperties[field[0]] = field;
				info.CustomFieldsProperties.push(field[0]);
			}
		}
	}		
	return info;
}

/**
 * Get movie from its number
 * @param id {integer} movie number
 * @return {object} movie object
 */
Amc.prototype.getMovieById = function (id) {
	var xmlNodeMovie;

	if (this.doc === undefined) {
		return {}
	}
	
	xmlNodeMovie = xpath.select('//Movie[@Number="{id}"]'.replace('{id}',id), this.root);

	if (xmlNodeMovie.length > 0) {
		return getMovieFromNode(xmlNodeMovie[0]);
	} else {
		return {};
	}
}

/**
 * Get all movies from  the catalog
 * @return {array} an array all movies in the catalog
 */
Amc.prototype.getAllMovies = function () {
	var xmlNodeMovies,
		movies = [],
		i;

	if (this.doc === undefined) {
		return {}
	}

	xmlNodeMovies = xpath.select('//Movie', this.root);
	
	if (xmlNodeMovies.length > 0) {
		for (i = 0 ; i < xmlNodeMovies.length ; i++) {
			movies.push(getMovieFromNode(xmlNodeMovies[i]));
		}
	}
	
	return movies;
}

/**
 * Get all movies from  the catalog
 * @return {array} an array all movies in the catalog (simplified list)
 */
Amc.prototype.getMoviesLite = function () {
	var xmlNodeMovies,
		movies = [],
		i;

	if (this.doc === undefined) {
		return {}
	}

	xmlNodeMovies = xpath.select('//Movie', this.root);
	
	if (xmlNodeMovies.length > 0) {
		for (i = 0 ; i < xmlNodeMovies.length ; i++) {
			movies.push(getMovieFromNodeLite(xmlNodeMovies[i]));
		}
	}
	
	return movies;
}

/**
 * Get numbers of movies in the catalog
 * @return {integer} number of movies in the catalog
 */
Amc.prototype.length = function () {
	return (this.doc === undefined) ? 0 : xpath.select('//Movie', this.root).length;
}

/**
 * Get a Javascript object from the xml
 * @return {object} a Javascript object corresponding to the xml catalog opened
 */
Amc.prototype.getCatalogObject = function () {
	var catalog = this.getCatalogInfo();
	
	catalog.movies = this.getAllMovies();
	
	return catalog;
}


exports.Amc = Amc;