/*
	you include this js file, it creates the iframe, which is sitting on the host you want to speak to.
	that iframe sends a message back to the parent to say it is ready, triggering a 'crossDomainAjaxLoaded' event
	you can then post messages to the host using $.postMessage
*/
var iframeHost = window.iframeCommsTarget || "http://tiddlyspace.com",
	windowHost = window.location.host,
	space = windowHost.substring(0,windowHost.indexOf(".")),
	host = window.location.protocol+"//"+windowHost, // "http://attn-test.tiddlyspace.com",
	iframeURL = iframeHost+"/bags/"+space+"_public/tiddlers/iframe-comms2?host="+encodeURIComponent(host), // used to be 'attn_public' bag
	$ = jQuery;

//$(document).ready(function() {
	window.iframeComms = $('<iframe id="iFrameComms" src="'+iframeURL+'"></iframe>')
		.appendTo('body')
		.get(0)
		.contentWindow;
	console.log('gateway added to page',iframeURL);
	$.receiveMessage(
		function(e) {
			console.log('host received message');
			$(document).trigger('crossDomainAjaxLoaded'); // we could explicitly check for this status, but the first message shows it's working
		},
		iframeHost
	);
	$.ajax = function(options) {
		var handlers = {
			success: options.success,
			error: options.error
		};
		$.receiveMessage(
			function(e) {
				var bits = $.deparam(e.data),
					status = bits.status,
					data = bits.data,
					mockXhr;
				if(typeof data==="string") {
					data = data.replace(/\+/g,' ');
				}
				if(status==="success") {
					mockXhr = {
						getResponseHeader: function() {
							return data.xhr.Etag;
						}
					};
					handlers.success(data.response, data.status, mockXhr);
				} else if(status==="error") {
					handlers.error(data.xhr, data.textStatus, data.errorThrown);
				}
			},
			iframeHost
		);
		delete options.success;
		delete options.error;
		$.postMessage( // this calls options.success and options.error if they exist
			options,
			iframeURL,
			window.iframeComms
		);
	};
//});

/*!
 *
 * $.deparam from this library by Ben Alman
 *
 * jQuery BBQ: Back Button & Query Library - v1.3pre - 8/26/2010
 * http://benalman.com/projects/jquery-bbq-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
$.deparam = function ( params, coerce ) {
    var obj = {},
      coerce_types = { 'true': !0, 'false': !1, 'null': null },
      decode = decodeURIComponent;
    
    // Iterate over all name=value pairs.
    $.each( params.replace( /\+/g, ' ' ).split( '&' ), function(j,v){
      var param = v.split( '=' ),
        key = decode( param[0] ),
        val,
        cur = obj,
        i = 0,
        
        // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
        // into its component parts.
        keys = key.split( '][' ),
        keys_last = keys.length - 1;
      
      // If the first keys part contains [ and the last ends with ], then []
      // are correctly balanced.
      if ( /\[/.test( keys[0] ) && /\]$/.test( keys[ keys_last ] ) ) {
        // Remove the trailing ] from the last keys part.
        keys[ keys_last ] = keys[ keys_last ].replace( /\]$/, '' );
        
        // Split first keys part into two parts on the [ and add them back onto
        // the beginning of the keys array.
        keys = keys.shift().split('[').concat( keys );
        
        keys_last = keys.length - 1;
      } else {
        // Basic 'foo' style key.
        keys_last = 0;
      }
      
      // Are we dealing with a name=value pair, or just a name?
      if ( param.length === 2 ) {
        val = decode( param[1] );
        
        // Coerce values.
        if ( coerce ) {
          val = val && !isNaN(val)            ? +val              // number
            : val === 'undefined'             ? undefined         // undefined
            : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
            : val;                                                // string
        }
        
        if ( keys_last ) {
          // Complex key, build deep object structure based on a few rules:
          // * The 'cur' pointer starts at the object top-level.
          // * [] = array push (n is set to array length), [n] = array if n is 
          //   numeric, otherwise object.
          // * If at the last keys part, set the value.
          // * For each keys part, if the current level is undefined create an
          //   object or array based on the type of the next keys part.
          // * Move the 'cur' pointer to the next level.
          // * Rinse & repeat.
          for ( ; i <= keys_last; i++ ) {
            key = keys[i] === '' ? cur.length : keys[i];
            cur = cur[key] = i < keys_last
              ? cur[key] || ( keys[i+1] && isNaN( keys[i+1] ) ? {} : [] )
              : val;
          }
          
        } else {
          // Simple key, even simpler rules, since only scalars and shallow
          // arrays are allowed.
          
          if ( $.isArray( obj[key] ) ) {
            // val is already an array, so push on the next value.
            obj[key].push( val );
            
          } else if ( obj[key] !== undefined ) {
            // val isn't an array, but since a second value has been specified,
            // convert val into an array.
            obj[key] = [ obj[key], val ];
            
          } else {
            // val is a scalar.
            obj[key] = val;
          }
        }
        
      } else if ( key ) {
        // No value was defined, so set something meaningful.
        obj[key] = coerce
          ? undefined
          : '';
      }
    });
    
    return obj;
  };