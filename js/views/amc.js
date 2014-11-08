/** @jsx React.DOM */

define(['jquery','react', 'js/views/dialogs.js', 'js/utils.js'], function ($, React, Dialogs, Utils) {

	var hasChanged = false;

	/**
	 * React : Movie List item Component
	 */
	var MovieListItem = React.createClass({displayName: 'MovieListItem',
		handleClick: function (ev) {
			var options,
				id = this.props.movie.get('Number');

			ev.preventDefault();

			// Model was changed so ask user if he really want to load another movie
			if (hasChanged) {

				// Build options for the React component
				options = {
					title : 'Confirmation',
					text : 'Do you want to save changes you made to this movie ?',
					extra : 'If you do not save, your changes will be lost.',
					buttons : [
						{
							action : 'cancel',
							text : 'Cancel',
							dismiss : true,
							btnClass : 'default',
							callback : function () {}
						},
						{
							action : 'ignore',
							text : 'Continue',
							dismis : true,
							btnClass : 'warning',
							callback : function (ev) {
								//_loadMovie(id);
								$.publish('CloudMovieCatalog.MovieListItemClicked', id);
							}
						},
						{
							action : 'save',
							text : 'Save & Continue',
							dismiss : true,
							btnClass : 'primary',
							callback : function (ev) {
								loadedMovie.save(undefined, {
									success : function (model, response, options) {
										//_loadMovie(id);
										$.publish('CloudMovieCatalog.MovieListItemClicked', id);								
									},
									error : function (model, response, options) {
										console.log('Error');
									}
								});

							}
						}
					]
				};

				// Render the Modal
				React.render(React.createElement(Dialogs.ConfirmDialog, {model: options}), $('#js-confirm-dialog').get(0));

				// Show modal
				$("#js-confirm-dialog").modal('show');
	
			} else {
				// Load movie into model
				//_loadMovie(id);
				$.publish('CloudMovieCatalog.MovieListItemClicked', id);
			}

		},
		render: function () {
			//console.log(this.props);
			return React.createElement("tr", null, React.createElement("td", null, this.props.movie.get('Number')), React.createElement("td", {onClick: this.handleClick}, React.createElement("a", {href: "#", className: "block-link"}, this.props.movie.get('FormattedTitle'))));
		},
	});

	/**
	 * React : Movie List Component
	 */
	var MovieList = React.createClass({displayName: 'MovieList',
		render: function () {
			var movies = this.props.model.map(function (movie, index) {
				return React.createElement(MovieListItem, {key: 'movie-' + index, movie: movie});
			});
			return React.createElement("tbody", null, movies);
		}
	});

	/**
	 * React : Movie Media Fields Component (Media collapsable panel)
	 */
	var MediaFields = React.createClass({displayName: 'MediaFields',
		componentDidMount: function() {
			this.props.model.on('change', function() {
				this.forceUpdate();
			}.bind(this));
		},
		handleChange : function (ev) {
			$.publish('CloudMovieCatalog.ValueChanged', ev.target);
		},
		render : function () {
			var movie = this.props.model;
			
			return  React.createElement("div", {className: "accordion-inner"}, 
						React.createElement("label", {className: "field-label"}, 
							React.createElement("span", null, "Media Label :"), 
							React.createElement("input", {name: "MediaLabel", type: "text", className: "span2", value: movie.get('MediaLabel'), onChange: this.handleChange})
						), 
						React.createElement("label", {className: "field-label"}, 
							React.createElement("span", null, "Media Type :"), 
							React.createElement("input", {name: "MediaType", type: "text", className: "span2", value: movie.get('MediaType'), onChange: this.handleChange})
						), 
						React.createElement("label", {className: "field-label"}, 
							React.createElement("span", null, "Source :"), 
							React.createElement("input", {name: "Source", type: "text", className: "span2", value: movie.get('Source'), onChange: this.handleChange})
						), 
						React.createElement("label", {className: "field-label"}, 
							React.createElement("span", null, "Date Added :"), 
							React.createElement("input", {name: "Date", type: "text", className: "span2", value: movie.get('Date'), onChange: this.handleChange})
						), 
						React.createElement("label", {className: "field-label"}, 
							React.createElement("span", null, "Borrower :"), 
							React.createElement("input", {name: "Borrower", type: "text", className: "span2", value: movie.get('Borrower'), onChange: this.handleChange})
						), 
						React.createElement("label", {className: "field-label"}, 
							React.createElement("span", null, "Date Watched :"), 
							React.createElement("input", {name: "DateWatched", type: "text", className: "span2", value: movie.get('DateWatched'), onChange: this.handleChange})
						)
					)
		}
	});

	/**
	 * React : Movie Fields component (Movie collapsable panel)
	 */
	var MovieFields = React.createClass({displayName: 'MovieFields',
		componentDidMount: function() {
			this.props.model.on('change', function() {
				this.forceUpdate();
			}.bind(this));
		},
		handleChange : function (ev) {
			//console.log
			$.publish('CloudMovieCatalog.ValueChanged', ev.target);
		},
		render: function () {
			var movie = this.props.model;
			
			return  React.createElement("div", {className: "accordion-inner"}, 
						React.createElement("div", {className: "clearfix"}, 
							React.createElement("div", {className: "col-1"}, 
							React.createElement("label", {className: "field-label full-width"}, 
								React.createElement("span", null, "Original Title :"), 
								React.createElement("input", {name: "OriginalTitle", type: "text", className: "span2", value: movie.get('OriginalTitle'), onChange: this.handleChange})
							), 
							React.createElement("label", {className: "field-label full-width"}, 
								React.createElement("span", null, "Translated Title :"), 
								React.createElement("input", {name: "FormattedTitle", type: "text", className: "span2", value: movie.get('FormattedTitle'), onChange: this.handleChange})
							)
							), 
							React.createElement("div", {className: "col-2"}, 
								React.createElement("label", {className: "field-label"}, 
									React.createElement("span", null, "My Rating :"), 
									React.createElement("input", {name: "UserRating", type: "number", min: "0", max: "10", className: "span1", value: movie.get('UserRating'), onChange: this.handleChange})
								), 
								React.createElement("label", {className: "field-label"}, 
									React.createElement("span", null, "Rating :"), 
									React.createElement("input", {name: "Rating", type: "number", min: "0", max: "10", className: "span1", value: movie.get('Rating'), onChange: this.handleChange})
								)
							)
						), 
						React.createElement("div", {className: "clearfix"}, 
							React.createElement("div", {className: "col-1"}, 
								React.createElement("label", {className: "field-label"}, 
									React.createElement("span", null, "Director :"), 
									React.createElement("input", {name: "Director", type: "text", className: "span2", value: movie.get('Director'), onChange: this.handleChange})
								), 
								React.createElement("label", {className: "field-label"}, 
									React.createElement("span", null, "Producer :"), 
									React.createElement("input", {name: "Producer", type: "text", className: "span2", value: movie.get('Producer'), onChange: this.handleChange})
								), 
								React.createElement("label", {className: "field-label"}, 
									React.createElement("span", null, "Writer :"), 
									React.createElement("input", {name: "Writer", type: "text", className: "span2", value: movie.get('Writer'), onChange: this.handleChange})
								), 
								React.createElement("label", {className: "field-label"}, 
									React.createElement("span", null, "Composer :"), 
									React.createElement("input", {name: "Composer", type: "text", className: "span2", value: movie.get('Composer'), onChange: this.handleChange})
								)
							), 
							React.createElement("div", {className: "col-2"}, 
								React.createElement("label", {className: "field-label actors"}, 
									React.createElement("span", null, "Actors :"), 
									React.createElement("textarea", {name: "Actors", className: "actors", value: movie.get('Actors'), onChange: this.handleChange})
								)
							)
						), 
						React.createElement("div", {className: "clearfix"}, 
							React.createElement("div", {className: "col-1"}, 
								React.createElement("label", {className: "field-label"}, 
									React.createElement("span", null, "Country :"), 
									React.createElement("input", {name: "Country", type: "text", className: "span2", value: movie.get('Country'), onChange: this.handleChange})
								)
							), 
							React.createElement("div", {className: "col-2"}, 
								React.createElement("label", null, 
									React.createElement("span", null, "Year :"), 
									React.createElement("input", {name: "Year", type: "number", className: "span2", value: movie.get('Year'), onChange: this.handleChange})
								), 
								React.createElement("label", null, 
									React.createElement("span", null, "Length :"), 
									React.createElement("input", {name: "Length", type: "number", className: "span2", value: movie.get('Length'), onChange: this.handleChange})
								)
							)
						), 
						React.createElement("div", {className: "clearfix"}, 
							React.createElement("div", {className: "col-1"}, 
								React.createElement("label", {className: "field-label"}, 
									React.createElement("span", null, "Category :"), 
									React.createElement("input", {name: "Category", type: "text", className: "span2", value: movie.get('Category'), onChange: this.handleChange})
								)
							), 
							React.createElement("div", {className: "col-2"}, 
								React.createElement("label", {className: "field-label"}, 
									React.createElement("span", null, "Certification :"), 
									React.createElement("input", {name: "Certification", type: "text", className: "span2", value: movie.get('Certification'), onChange: this.handleChange})
								)
							)
						), 

						React.createElement("label", {className: "field-label"}, 
							React.createElement("span", null, "URL :"), 
							React.createElement("input", {name: "URL", type: "text", className: "span2", value: movie.get('URL'), onChange: this.handleChange})
						), 
						React.createElement("label", {className: "field-label"}, 
							React.createElement("span", null, "Description :"), 
							React.createElement("textarea", {name: "Description", value: movie.get('Description'), onChange: this.handleChange})
						), 
						React.createElement("label", {className: "field-label"}, 
							React.createElement("span", null, "Comments :"), 
							React.createElement("textarea", {name: "Comments", value: movie.get('Comments'), onChange: this.handleChange})
						)
					);
		},
	});
	
	/**
	 * React : Movie Fields component (Movie collapsable panel)
	 */
	var FileFields = React.createClass({displayName: 'FileFields',
		componentDidMount: function() {
			this.props.model.on('change', function() {
				this.forceUpdate();
			}.bind(this));
		},
		handleChange : function (ev) {
			$.publish('CloudMovieCatalog.ValueChanged', ev.target);
		},
		render: function () {
			var movie = this.props.model;
			
			return  React.createElement("div", {className: "accordion-inner"}, 
						React.createElement("label", {className: "field-label"}, 
							React.createElement("span", null, "File Path :"), 
							React.createElement("input", {name: "FilePath", type: "text", className: "span2", value: movie.get('FilePath'), onChange: this.handleChange})
						), 
						React.createElement("div", {className: "clearfix"}, 
							React.createElement("div", {className: "col-1"}, 
								React.createElement("label", {className: "field-label"}, 
									React.createElement("span", null, "Video Format :"), 
									React.createElement("input", {name: "VideoFormat", type: "text", className: "span2", value: movie.get('VideoFormat'), onChange: this.handleChange})
								)
							), 
							React.createElement("div", {className: "col-2"}, 
								React.createElement("label", null, 
									React.createElement("input", {name: "VideoBitrate", type: "number", className: "span2", value: movie.get('VideoBitrate'), onChange: this.handleChange})
								), 
								React.createElement("label", null, 
									React.createElement("span", null, "Resolution :"), 
									React.createElement("input", {name: "Resolution", type: "text", className: "span2", value: movie.get('Resolution'), onChange: this.handleChange})
								)
							)
						), 
						React.createElement("div", {className: "clearfix"}, 
							React.createElement("div", {className: "col-1"}, 
								React.createElement("label", {className: "field-label"}, 
									React.createElement("span", null, "Audio Format :"), 
									React.createElement("input", {name: "AudioFormat", type: "text", className: "span2", value: movie.get('AudioFormat'), onChange: this.handleChange})
								)
							), 
							React.createElement("div", {className: "col-2"}, 
								React.createElement("label", null, 
									React.createElement("input", {name: "AudioBitrate", type: "number", className: "span2", value: movie.get('AudioBitrate'), onChange: this.handleChange})
								), 
								React.createElement("label", null, 
									React.createElement("span", null, "Frame Rate :"), 
									React.createElement("input", {name: "Framerate", type: "text", className: "span2", value: movie.get('Framerate'), onChange: this.handleChange})
								)
							)
						), 
						React.createElement("div", {className: "clearfix"}, 
							React.createElement("div", {className: "col-1"}, 
								React.createElement("label", {className: "field-label"}, 
									React.createElement("span", null, "Languages :"), 
									React.createElement("input", {name: "Languages", type: "text", className: "span2", value: movie.get('Languages'), onChange: this.handleChange})
								)
							), 
							React.createElement("div", {className: "col-2"}, 
								React.createElement("label", null, 
									React.createElement("span", null, "File Size :"), 
									React.createElement("input", {name: "Size", type: "text", className: "span1", value: movie.get('Size'), onChange: this.handleChange})
								)
							)
						), 
						React.createElement("div", {className: "clearfix"}, 
							React.createElement("div", {className: "col-1"}, 
								React.createElement("label", {className: "field-label"}, 
									React.createElement("span", null, "Subtitles :"), 
									React.createElement("input", {name: "Subtitles", type: "text", className: "span2", value: movie.get('Subtitles'), onChange: this.handleChange})
								)
							), 
							React.createElement("div", {className: "col-2"}, 
								React.createElement("label", null, 
									React.createElement("span", null, "Disks/Files :"), 
									React.createElement("input", {name: "Disks", type: "text", className: "span1", value: movie.get('Disks'), onChange: this.handleChange})
								)
							)
						)
					);
		}
	});	

	return {
		MovieList : MovieList,
		MediaFields : MediaFields,
		MovieFields : MovieFields,
		FileFields : FileFields
	}
});