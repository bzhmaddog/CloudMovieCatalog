require.config({
    baseUrl : 'js/lib',
    paths : {
		jquery : 'jquery-2.1.1',
		pubsub : 'jquery.tiny-pubsub-min',
		bootstrap : 'bootstrap',
		react : 'react',
    },
	shim : {
		underscore : {
			exports : '_'
		},
		bootstrap : {
			deps : ['jquery']
		},
    	backbone : {
      		deps : ['underscore', 'jquery'],
			exports : 'Backbone'
		}
	}
});


require(
	['jquery', 'react', 'underscore', 'backbone', 'js/utils.js', 'pubsub', 'bootstrap', 'js/models/amc.js', 'js/views/dialogs.js', 'js/views/amc.js'],
	function($, React, _, Backbone, Utils, undefined, undefined, AMCModels, Dialogs, AMCViews) {

		var $saveConfirmDialog = $('#saveConfirmDialog'),
			$mediaFields = $('#collapseMedia'),
			$movieFields = $('#collapseMovie'),
			$fileFields = $('#collapseFile'),
			$moviesList = $('#js-movies-list');

		var hasChanged = false,
			moviesList,
			loadedMovie;


		var AMC = {
			Models : AMCModels,
			Views : AMCViews
		};


		/**
		 * Load a movie into the object
		 * @param id {integer} the movie id/number
		 */		
		function _loadMovie(id) {
			// Load movie in the Model
			loadedMovie.fetch({
				url : Utils.getAPIUrl('movie/' + id),
				success : function () {
					hasChanged = false;
				}
			});
		}


		/**
		 * Handle changes in the form fields, if input name is defined then update the model property
		 * @param ev {event} DOM event
		 */
		function _handleFieldChange(ev, element) {
			if (typeof element.name === 'undefined') {
				console.log('You binded an onChange without giving a name to your input !!');
				return;
			}

			console.log(element.name, element.value);

			loadedMovie.set(element.name, element.value);
			hasChanged = true;
		}



		$(document).ready(function () {

			// Create a List of Movies 
			moviesList = new AMC.Models.MoviesListCollection();

			// Create an empty movie model to be filled with API
			loadedMovie = new AMC.Models.Movie();

			// Load list of movies via Ajax
			moviesList.fetch({
				success: function(collection, response) {
					
					// Render the list of movies via the React component
					React.render(React.createElement(AMC.Views.MovieList,{model : collection.models}), $moviesList.get(0));

					// Render the fields (empty) area Via React
					React.render(React.createElement(AMC.Views.MediaFields, {model : loadedMovie}), $mediaFields.get(0));
					React.render(React.createElement(AMC.Views.MovieFields, {model : loadedMovie}), $movieFields.get(0));
					React.render(React.createElement(AMC.Views.FileFields, {model : loadedMovie}), $fileFields.get(0));
				}
			});

			// Bind clicks on the fields tabs
			/*$('#js-movie-details-tabs a').click(function (ev) {
				ev.preventDefault();
				$(this).tab('show');
			});*/

			$.subscribe('CloudMovieCatalog.MovieListItemClicked', function () {
				var id = parseInt(arguments[1], 10);
				console.log('CloudMovieCatalog.MovieListItemClicked', arguments);
				if (!isNaN(id)) {
					_loadMovie(id);
				} else {
					console.log('CloudMovieCatalog.MovieListItemClicked::Error', 'Invalid movie Id');
				}
			});

			$.subscribe('CloudMovieCatalog.ValueChanged', _handleFieldChange)

		});


	}
);


