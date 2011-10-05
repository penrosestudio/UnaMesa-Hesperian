/* usage: $(elem).stripload(url, [params], [callback]); */

jQuery.fn.stripload = function(url, params, callback) {
	
	/* identical tp $.load but strips out link tags too so IE6 doesn't fail to load them, delaying response time */
	
	if ( typeof url !== "string" )
		return this._load( url );

	var off = url.indexOf(" ");
	if ( off >= 0 ) {
		var selector = url.slice(off, url.length);
		url = url.slice(0, off);
	}

	// Default to a GET request
	var type = "GET";

	// If the second parameter was provided
	if ( params )
		// If it's a function
		if ( jQuery.isFunction( params ) ) {
			// We assume that it's the callback
			callback = params;
			params = null;

		// Otherwise, build a param string
		} else if( typeof params === "object" ) {
			params = jQuery.param( params );
			type = "POST";
		}

	var self = this;
	
	// Request the remote document
	jQuery.ajax({
		url: url,
		type: type,
		dataType: "html",
		data: params,
		complete: function(res, status){
			// If successful, inject the HTML into all the matched elements
			if ( status == "success" || status == "notmodified" )
				// See if a selector was specified
				self.html( selector ?
					// Create a dummy div to hold the results
					jQuery("<div/>")
						// inject the contents of the document in, removing the scripts
						// to avoid any 'Permission Denied' errors in IE
						.append(res.responseText.replace(/<script(.|\s)*?\/script>/g, "").replace(/<link(.|\s)*?\/>/g,""))

						// Locate the specified elements
						.find(selector) :

					// If not, just inject the full result
					res.responseText );

			if( callback )
				self.each( callback, [res.responseText, status, res] );
		}
	});
	return this;
};