/*{{{*/
config.macros.handbook = {
	handler: function(place, macroName, params, wikifier, paramString, tiddler) {
		var template = store.getRecursiveTiddlerText('HandbookTemplate');
		// find all my handbooks
		// put them through the template
		$.ajax({
			url: '/spaces?mine=1',
			dataType: 'json',
			success: function(data) {
				var list = ["<ul>"],
					out;
				if(data && data.length) {
					$(data).each(function() {
						list.push('<li><a href="'+this.uri+'">'+this.name+'</a></li>');
					});
					list.push(["</ul>"]);
					out = list.join("\n");
				} else {
					out = "you do not have any handbooks";
				}
				$(place).append(out);
			}
		});
	}
};
/*}}}*/