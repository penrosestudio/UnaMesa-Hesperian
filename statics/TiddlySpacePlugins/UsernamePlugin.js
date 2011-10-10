/*{{{*/
config.macros.username = {
	handler: function(place) {
		var tweb = config.extensions.tiddlyweb,
			username = tweb.username,
			$ = jQuery,
			$container = $("<span></span>").appendTo(place),
			callback = function(name) {
				$container.append(name);
			};
		if(!username) {
			tweb.getUserInfo(function(user) {
				callback(user.name);
			});
		} else {
			callback(username);
		}
	}
};
/*}}}*/