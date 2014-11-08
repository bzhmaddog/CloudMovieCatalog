
define(['jquery', 'backbone'], function ($, Backbone) {

	/**
	 * Return api url for path
	 * @param path {string} path requested
	 * @return {string} api url
	 */
	function api(path) {
		return 'http://api.amcviewer.com/' + path;
	}

// Default values for the movie fields
	var movieFields = {
		Number : 0,
		OriginalTitle : '',
		TranslatedTile : '',
		FormattedTitle: '',
		Director : '',
		Producer : '',
		Writer : '',
		Composer : '',
		Actors : '',
		Country : '',
		Category : '',
		URL : '',
		Description : '',
		Comments : '',
		Checked : '',
		ColorTag : '',
		MediaLabel : '',
		MediaType : '',
		Source : '',
		'Date' : '',
		DateWatched : '',
		Borrower : '',
		UserRating : '',
		Rating : '',
		Year : '',
		Length : '',
		Certification : '',
		FilePath : '',
		VideoFormat : '',
		VideoBitrate : '',
		AudioFormat : '',
		AudioBitrate : '',
		Resolution : '',
		Framerate : '',
		Languages : '',
		Subtitles : '',
		Size : '',
		Disks : '',
		CustomFields : {},
		Extras : {}
	};

	/**
	 * Backbone Movie Model
	 */
	var Movie = Backbone.Model.extend({
		// Parse the response to initialize missing fields (xml file does not contains attributes if they are empty)
		parse : function (response, options) {
			return $.extend({}, movieFields, response);
		},
		url : api('movie'), // url to post data
		defaults : movieFields
	});

	/**
	 * Backbone MovieLite Model
	 */
	var MovieLite = Backbone.Model.extend({
		defaults: {
			Number : 0,
			FormattedTitle : ''
		}
	});
	
	/**
	 * Backbone collection : Array of MovieLite
	 */
	var MoviesListCollection = Backbone.Collection.extend({
		model : MovieLite,
		url : api('list')
	});

	return {
		Movie : Movie,
		MovieLite : MovieLite,
		MoviesListCollection : MoviesListCollection
	}
});

