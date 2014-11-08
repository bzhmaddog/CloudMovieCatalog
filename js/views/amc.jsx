/** @jsx React.DOM */

define(['jquery','react', 'js/utils.js'], function ($, React, Utils) {


	/**
	 * React : Movie List item Component
	 */
	var MovieListItem = React.createClass({
		handleClick: function (ev) {
			var id = parseInt(this.props.movie.get('Number'), 10);
			ev.preventDefault();
			$.publish('CloudMovieCatalog.MovieListItemClicked', id);
		},
		render: function () {
			return <tr><td>{this.props.movie.get('Number')}</td><td onClick={this.handleClick}><a href="#" className={"block-link"}>{this.props.movie.get('FormattedTitle')}</a></td></tr>;
		},
	});

	/**
	 * React : Movie List Component
	 */
	var MovieList = React.createClass({
		render: function () {
			var movies = this.props.movies.map(function (movie, index) {
				return <MovieListItem key={'movie-' + index} movie={movie} />;
			});
			return <tbody>{movies}</tbody>;
		}
	});

	/**
	 * React : Movie Media Fields Component (Media collapsable panel)
	 */
	var MediaFields = React.createClass({
		componentDidMount: function() {
			this.props.movie.on('change', function() {
				this.forceUpdate();
			}.bind(this));
		},
		handleChange : function (ev) {
			$.publish('CloudMovieCatalog.ValueChanged', ev.target);
		},
		render : function () {
			var movie = this.props.movie;
			
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
	var MovieFields = React.createClass({
		componentDidMount: function() {
			this.props.movie.on('change', function() {
				this.forceUpdate();
			}.bind(this));
		},
		handleChange : function (ev) {
			$.publish('CloudMovieCatalog.ValueChanged', ev.target);
		},
		render: function () {
			var movie = this.props.movie;
			
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
	var FileFields = React.createClass({
		componentDidMount: function() {
			this.props.movie.on('change', function() {
				this.forceUpdate();
			}.bind(this));
		},
		handleChange : function (ev) {
			$.publish('CloudMovieCatalog.ValueChanged', ev.target);
		},
		render: function () {
			var movie = this.props.movie;
			
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

	return {
		MovieList : MovieList,
		MediaFields : MediaFields,
		MovieFields : MovieFields,
		FileFields : FileFields
	}
});