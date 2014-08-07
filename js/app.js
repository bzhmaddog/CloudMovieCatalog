/** @jsx React.DOM */

(function($){
	'use strict';

	var $saveConfirmDialog = $('#saveConfirmDialog'),
		movieFields,
		DialogButton,
		ConfirmDialog,
		MovieListItem,
		MovieList,
		MediaFields,
		MovieFields,
		FileFields,
		apiUrl = 'http://api.amcviewer.com/',
		Movie,
		MovieLite,
		MoviesListCollection,
		moviesList,
		loadedMovie,
		hasChanged = false;

	/**
	 * Handle closing of Dialog boxes
	 * @param ev {event} DOM event
	 */
	/*function _handleModalClose(ev) {
		
		if (ev.target === $saveConfirmDialog.get(0)) {
			console.log(ev);
		}

	}*/

	/**
	 * Handle changes in the form fields, if input name is defined then update the model property
	 * @param ev {event} DOM event
	 */
	function _handleFieldChange(ev) {
		if (typeof ev.target.name === 'undefined') {
			console.log('You binded an onChange without giving a name to your input !!');
			return;
		}

		this.props.model.set(ev.target.name, ev.target.value);
		hasChanged = true;
	}

	/**
	 * Load a movie into the object
	 * @param id {integer} the movie id/number
	 */		
	function _loadMovie(id) {
		// Load movie in the Model
		loadedMovie.fetch({
			url : api('movie/' + id),
			success : function () {
				hasChanged = false;
			}
		});
	}

	/**
	 * Return api url for path
	 * @param path {string} path requested
	 * @return {string} api url
	 */
	function api(path) {
		return apiUrl + path;
	}

	// Default values for the movie fields
	movieFields = {
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
	Movie = Backbone.Model.extend({
		// Parse the response to initialize missing fields (xml file does not contains attributes if they are empty)
		parse : function (response, options) {
			return $.extend({}, movieFields, response);
		},
		url : api('movie'), // url to post data
		defaults: movieFields
	});

	/**
	 * Backbone MovieLite Model
	 */
	MovieLite = Backbone.Model.extend({
		defaults: {
			Number : 0,
			FormattedTitle : ''
		}
	});
	
	/**
	 * Backbone collection : Array of MovieLite
	 */
	MoviesListCollection = Backbone.Collection.extend({
		model : MovieLite,
		url : api('list')
	});

	/**
	 * React : Dialog button component
	 */
	DialogButton = React.createClass({
		render : function () {
			var btnClass = "btn btn-" + this.props.model.btnClass;

			return <button onClick={this.props.model.handleClick} type="button" className={btnClass} data-dismiss="modal" data-action={this.props.model.action}>{this.props.model.text}</button>
		}
	});

	/**
	 * React : Dialog component using Bootstrap modal
	 */
	ConfirmDialog = React.createClass({
		componentDidUpdate : function () {
			//$("#js-confirm-dialog").modal('show'); // show the modal automatically when the component update
		},
		// handle click events on the buttons
		handleClick : function (ev) {
			var action = $(ev.target).data('action'),
				buttons = this.props.model.buttons,
				l = buttons.length;

			for (var i = 0 ; i < l ; i++) {
				if (buttons[i].action === action && typeof buttons[i].callback === 'function') {
					buttons[i].callback.call(this, ev);
					break;
				}
			}
		},
		render : function () {
			var _handleClick = this.handleClick,
				buttons;

			buttons = this.props.model.buttons.map(function (button) {
				var btnModel = button;
				btnModel.handleClick = _handleClick;
				//delete btnModel.callback;
	
				return <DialogButton model={btnModel} />;
			});

			return	<div className={"modal-dialog"}>
						<div className={"modal-content"}>
							<div className={"modal-header"}>
								<button type="button" className={"close"} data-dismiss="modal" aria-hidden="true">&times;</button>
								<h4 className={"modal-title"}>{this.props.model.title}</h4>
							</div>
							<div className={"modal-body"}>
								<p>{this.props.model.text}</p>
								<p className={"text-warning"}><small>{this.props.model.extra}</small></p>
							</div>
							<div className={"modal-footer"}>
								{buttons}
							</div>
						</div>
					</div>;
		}
	});


	/**
	 * React : Movie List item Component
	 */
	MovieListItem = React.createClass({
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
								_loadMovie(id);
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
										_loadMovie(id);										
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
				React.renderComponent(<ConfirmDialog model={options} />, $('#js-confirm-dialog').get(0));

				// Show modal
				$("#js-confirm-dialog").modal('show');
	
			} else {
				// Load movie into model
				_loadMovie(id);
			}

		},
		render: function () {
			//console.log(this.props);
			return <tr><td>{this.props.movie.get('Number')}</td><td onClick={this.handleClick}><a href="#" className={"block-link"}>{this.props.movie.get('FormattedTitle')}</a></td></tr>;
		},
	});

	/**
	 * React : Movie List Component
	 */
	MovieList = React.createClass({
		/*handleClick: function (ev) {
		//	console.log(arguments);
		},*/
		/*getInitialState: function () {
			return { movies: [] };
		},*/
		/*componentDidMount: function() {
			//window.addEventListener('click', this.handleClick);
  		},*/
		render: function () {
			var movies = this.props.model.map(function (movie) {
				return <MovieListItem movie={movie} />;
			});
			return <tbody>{movies}</tbody>;
		}
	});

	/**
	 * React : Movie Media Fields Component (Media collapsable panel)
	 */
	MediaFields = React.createClass({
		componentDidMount: function() {
			this.props.model.on('change', function() {
				this.forceUpdate();
			}.bind(this));
		},
		handleChange : _handleFieldChange,
		render : function () {
			var movie = this.props.model;
			
			return  <div className={"accordion-inner"}>
						<label className={"field-label"}>
							<span>Media Label :</span>
							<input name="MediaLabel" type="text" className={"span2"} value={movie.get('MediaLabel')} onChange={this.handleChange} />
						</label>
						<label className={"field-label"}>
							<span>Media Type :</span>
							<input name="MediaType" type="text" className={"span2"} value={movie.get('MediaType')} onChange={this.handleChange} />
						</label>
						<label className={"field-label"}>
							<span>Source :</span>
							<input name="Source" type="text" className={"span2"} value={movie.get('Source')} onChange={this.handleChange} />
						</label>
						<label className={"field-label"}>
							<span>Date Added :</span>
							<input name="Date" type="text" className={"span2"} value={movie.get('Date')} onChange={this.handleChange} />
						</label>
						<label className={"field-label"}>
							<span>Borrower :</span>
							<input name="Borrower" type="text" className={"span2"} value={movie.get('Borrower')} onChange={this.handleChange} />
						</label>
						<label className={"field-label"}>
							<span>Date Watched :</span>
							<input name="DateWatched" type="text" className={"span2"} value={movie.get('DateWatched')} onChange={this.handleChange} />
						</label>
					</div>
		}
	});

	/**
	 * React : Movie Fields component (Movie collapsable panel)
	 */
	MovieFields = React.createClass({
		componentDidMount: function() {
			this.props.model.on('change', function() {
				this.forceUpdate();
			}.bind(this));
		},
		handleChange : _handleFieldChange,
		render: function () {
			var movie = this.props.model;
			
			return  <div className={"accordion-inner"}>
						<div className={"clearfix"}>
							<div className={"col-1"}>
							<label className={"field-label full-width"}>
								<span>Original Title :</span>
								<input name="OriginalTitle" type="text" className={"span2"} value={movie.get('OriginalTitle')} onChange={this.handleChange} />
							</label>
							<label className={"field-label full-width"}>
								<span>Translated Title :</span>
								<input name="FormattedTitle" type="text" className={"span2"} value={movie.get('FormattedTitle')} onChange={this.handleChange} />
							</label>
							</div>
							<div className={"col-2"}>
								<label className={"field-label"}>
									<span>My Rating :</span>
									<input name="UserRating" type="number" min="0" max="10" className={"span1"} value={movie.get('UserRating')} onChange={this.handleChange} />
								</label>
								<label className={"field-label"}>
									<span>Rating :</span>
									<input name="Rating" type="number" min="0" max="10" className={"span1"} value={movie.get('Rating')} onChange={this.handleChange} />
								</label>
							</div>
						</div>
						<div className={"clearfix"}>
							<div className={"col-1"}>
								<label className={"field-label"}>
									<span>Director :</span>
									<input name="Director" type="text" className={"span2"} value={movie.get('Director')} onChange={this.handleChange} />
								</label>
								<label className={"field-label"}>
									<span>Producer :</span>
									<input name="Producer" type="text" className={"span2"} value={movie.get('Producer')} onChange={this.handleChange} />
								</label>
								<label className={"field-label"}>
									<span>Writer :</span>
									<input name="Writer" type="text" className={"span2"} value={movie.get('Writer')} onChange={this.handleChange} />
								</label>
								<label className={"field-label"}>
									<span>Composer :</span>
									<input name="Composer" type="text" className={"span2"} value={movie.get('Composer')} onChange={this.handleChange} />
								</label>
							</div>
							<div className={"col-2"}>
								<label className={"field-label actors"}>
									<span>Actors :</span>
									<textarea name="Actors" className={"actors"} value={movie.get('Actors')} onChange={this.handleChange}></textarea>
								</label>
							</div>
						</div>
						<div className={"clearfix"}>
							<div className={"col-1"}>
								<label className={"field-label"}>
									<span>Country :</span>
									<input name="Country" type="text" className={"span2"} value={movie.get('Country')} onChange={this.handleChange} />
								</label>
							</div>
							<div className={"col-2"}>
								<label>
									<span>Year :</span>
									<input name="Year" type="number" className={"span2"} value={movie.get('Year')} onChange={this.handleChange} />
								</label>
								<label>
									<span>Length :</span>
									<input name="Length" type="number" className={"span2"} value={movie.get('Length')} onChange={this.handleChange} />
								</label>
							</div>
						</div>
						<div className={"clearfix"}>
							<div className={"col-1"}>
								<label className={"field-label"}>
									<span>Category :</span>
									<input name="Category" type="text" className={"span2"} value={movie.get('Category')} onChange={this.handleChange} />
								</label>
							</div>
							<div className={"col-2"}>
								<label className={"field-label"}>
									<span>Certification :</span>
									<input name="Certification" type="text" className={"span2"} value={movie.get('Certification')} onChange={this.handleChange} />
								</label>
							</div>
						</div>

						<label className={"field-label"}>
							<span>URL :</span>
							<input name="URL" type="text" className={"span2"} value={movie.get('URL')} onChange={this.handleChange} />
						</label>
						<label className={"field-label"}>
							<span>Description :</span>
							<textarea name="Description" value={movie.get('Description')} onChange={this.handleChange}></textarea>
						</label>
						<label className={"field-label"}>
							<span>Comments :</span>
							<textarea name="Comments" value={movie.get('Comments')} onChange={this.handleChange}></textarea>
						</label>
					</div>;
		},
	});
	
	/**
	 * React : Movie Fields component (Movie collapsable panel)
	 */
	FileFields = React.createClass({
		componentDidMount: function() {
			this.props.model.on('change', function() {
				this.forceUpdate();
			}.bind(this));
		},
		handleChange : _handleFieldChange,
		render: function () {
			var movie = this.props.model;
			
			return  <div className={"accordion-inner"}>
						<label className={"field-label"}>
							<span>File Path :</span>
							<input name="FilePath" type="text" className={"span2"} value={movie.get('FilePath')} onChange={this.handleChange} />
						</label>
						<div className={"clearfix"}>
							<div className={"col-1"}>
								<label className={"field-label"}>
									<span>Video Format :</span>
									<input name="VideoFormat" type="text" className={"span2"} value={movie.get('VideoFormat')} onChange={this.handleChange} />
								</label>
							</div>
							<div className={"col-2"}>
								<label>
									<input name="VideoBitrate" type="number" className={"span2"} value={movie.get('VideoBitrate')} onChange={this.handleChange} />
								</label>
								<label>
									<span>Resolution :</span>
									<input name="Resolution" type="text" className={"span2"} value={movie.get('Resolution')} onChange={this.handleChange} />
								</label>
							</div>
						</div>
						<div className={"clearfix"}>
							<div className={"col-1"}>
								<label className={"field-label"}>
									<span>Audio Format :</span>
									<input name="AudioFormat" type="text" className={"span2"} value={movie.get('AudioFormat')} onChange={this.handleChange} />
								</label>
							</div>
							<div className={"col-2"}>
								<label>
									<input name="AudioBitrate" type="number" className={"span2"} value={movie.get('AudioBitrate')} onChange={this.handleChange} />
								</label>
								<label>
									<span>Frame Rate :</span>
									<input name="Framerate" type="text" className={"span2"} value={movie.get('Framerate')} onChange={this.handleChange} />
								</label>
							</div>
						</div>
						<div className={"clearfix"}>
							<div className={"col-1"}>
								<label className={"field-label"}>
									<span>Languages :</span>
									<input name="Languages" type="text" className={"span2"} value={movie.get('Languages')} onChange={this.handleChange} />
								</label>
							</div>
							<div className={"col-2"}>
								<label>
									<span>File Size :</span>
									<input name="Size" type="text" className={"span1"} value={movie.get('Size')} onChange={this.handleChange} />
								</label>
							</div>
						</div>
						<div className={"clearfix"}>
							<div className={"col-1"}>
								<label className={"field-label"}>
									<span>Subtitles :</span>
									<input name="Subtitles" type="text" className={"span2"} value={movie.get('Subtitles')} onChange={this.handleChange} />
								</label>
							</div>
							<div className={"col-2"}>
								<label>
									<span>Disks/Files :</span>
									<input name="Disks" type="text" className={"span1"} value={movie.get('Disks')} onChange={this.handleChange} />
								</label>
							</div>
						</div>
					</div>;
		}
	});	
	// Create a List of Movies 
	moviesList = new MoviesListCollection();

	// Create an empty movie model to be filled with API
	loadedMovie = new Movie();
	//loadedMovie.startTracking();

	console.log(loadedMovie.get('Number'));

	window.test = loadedMovie;

	// Load list of movies via Ajax
	moviesList.fetch({
		success: function(collection, response) {
			
			// Render the list of movies via the React component
			React.renderComponent(<MovieList  model={collection.models} />, $('#js-movies-list').get(0));

			// Render the fields (empty) area Via React
			React.renderComponent(<MediaFields model={loadedMovie}/>, $('#collapseMedia').get(0));
			React.renderComponent(<MovieFields model={loadedMovie}/>, $('#collapseMovie').get(0));
			React.renderComponent(<FileFields model={loadedMovie}/>, $('#collapseFile').get(0));
		}
	});


	$(document).ready(function () {
		// Bind clicks on the fields tabs
		$('#js-movie-details-tabs a').click(function (ev) {
			ev.preventDefault();
			$(this).tab('show');
		});

		//$(document).on('hidden.bs.modal', _handleModalClose);
	});

}(jQuery));