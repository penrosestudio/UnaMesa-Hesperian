function setFragID(url) {
	url = url || "";
	if(url.lastIndexOf('/')!==-1) {
		url = url.substring(url.lastIndexOf('/')+1);
	}
	window.location.hash = url;
}

function getFragID() {
	return window.location.hash.replace(/^#/,"");
}

function startWatchingHash() {
	(function() {
		if(window.location.hash!==arguments.callee.hash) {
			$(document).trigger('hashChange');
		}
		arguments.callee.hash = window.location.hash;
		window.setTimeout(arguments.callee,200);
	})();
}

// bind navigation to frag ID changes
$(document).ready(function() {
	$(document).bind('hashChange', function() {
		var hash = getFragID();
		if(hash) {
			// do something
		}
	});
	startWatchingHash();
});