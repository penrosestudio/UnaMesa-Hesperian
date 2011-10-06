config.extensions.UnaMesaSetup = {
	dispatch: function() {
		var space = window.location.host.replace("www.","").split(".")[0],
			tid = new tiddlyweb.Tiddler("ServerSettings", new tiddlyweb.Bag(space + "_public", "/"));
		if(!store.getTiddler('ServerSettings')) {
			tid.text = "index: index\n";
			tid.type = "text/config";
			tid.tags = ["excludeLists"];
			tid.fields = {
				"server.content-type": "text/config"
			};
			tid.put(function() {
				console.log(arguments);
				//window.location = window.location.protocol + "//" + window.location.host;
			}, function() {});
		}
	}
};

jQuery(document).bind("loadPlugins", config.extensions.UnaMesaSetup.dispatch);