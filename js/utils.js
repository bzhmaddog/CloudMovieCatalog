define(function () {

	var apiUrl = 'http://api.amcviewer.com/';

	/**
	 * Return api url for path
	 * @param path {string} path requested
	 * @return {string} api url
	 */
	function build(path) {
		return apiUrl + path;
	}

	return {
		getAPIUrl : build
	}
});