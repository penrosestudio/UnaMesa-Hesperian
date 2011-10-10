/*{{{*/
var admin = config.macros.TiddlySpaceAdmin,
	tsl = config.macros.TiddlySpaceLogin,
	tweb = config.extensions.tiddlyweb,
	formMaker = config.extensions.formMaker,
	$ = jQuery;
config.extensions.formMaker.locale.tryAgain = ""; // was "try again"
// this is mainly the same as in the default macro
config.macros.TiddlySpaceRegister.register = function(username, password, form) {
	var locale = admin.locale;
	var options = {
		annotate: "[name=username]"
	};
	var userCallback = function(resource, status, xhr) {
		tsl.login(username, password, function(data, status, xhr) {
			var space = new tiddlyweb.Space(username, tweb.host);
			space.create(spaceCallback, spaceErrback);
		});
	};
	var userErrback = function(xhr, error, exc) {
		var msg = xhr.status === 409 ? locale.userError.format(username) : false;
		formMaker.displayMessage(form, msg, true, options);
	};
	var spaceCallback = function() {
		formMaker.displayMessage(form, locale.spaceSuccess.format(username), true);

		// now change the recipe to include the theme space
		// might have to do private recipe too...
		
		// include the iframe-comms script
		var host = window.location.host,
			parentHost = host.split('.').splice(1).join('.');
		window.iframeCommsTarget = window.location.protocol+"//"+parentHost;
		$(document).bind('crossDomainAjaxLoaded', function() {
			//console.log('crossDomainAjaxLoaded');
			// this copied from config.macros.TiddlySpaceInclusion
			var data = {
				subscriptions: ["unamesa-theme"]
			};
			$.ajax({
				url: window.iframeCommsTarget + "/spaces/" + username,
				type: "POST",
				contentType: "application/json",
				data: $.toJSON(data),
				success: function() {
					//console.log("subscription success");
					var bag = new tiddlyweb.Bag(username+"_public", window.iframeCommsTarget),
						tiddler = new tiddlyweb.Tiddler("DefaultTiddlers", bag);
					tiddler.text = "GettingStarted\n[[Your Handbooks]]";
					tiddler.put(function() {
						//console.log("DefaultTiddlers success");
						window.location = window.location.protocol+"//"+username+"."+parentHost;	
					}, function() {
						//console.log("DefaultTiddlers failure");
					});
				},
				error: function() {
					//console.log("subscription failure");
				}
			});
			/* previous method - used recipe manipulation and does not work (although it does PUT the right stuff)
			var host = window.location.host,
				stem = host.substring(host.indexOf(".")+1),
				//newhost = window.location.protocol+"//"+username+"."+stem,
				recipe = new tiddlyweb.Recipe(username+"_public", window.iframeCommsTarget);
			recipe.get(function(r, status, xhr) {
				recipe = r;
				recipe.recipe.splice(recipe.recipe.length-1,0,["unamesa-theme_public", ""]);
				recipe.put(function() {
					console.log('recipe PUT success');
					//tsl.redirect();
				}, function() {
					console.log('recipe PUT error',arguments);
				});
			}, function() {
				console.log('recipe GET error',arguments);
			});*/
		});
		//console.log('opening gateway to '+window.iframeCommsTarget);
		$.getScript('/iframe-comms2.js');
	};
	var spaceErrback = function(xhr, error, exc) {
		var msg = xhr.status === 409 ? locale.spaceError.format(username) : false; // XXX: 409 unlikely to occur at this point
		formMaker.displayMessage(form, msg, true, options);
	};
	var user = new tiddlyweb.User(username, password, tweb.host);
	user.create(userCallback, userErrback);
};
/*}}}*/