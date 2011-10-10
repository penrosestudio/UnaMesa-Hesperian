/*{{{*/
config.macros.handbook = {
	handler: function(place, macroName, params, wikifier, paramString, tiddler) {
		var template = store.getRecursiveTiddlerText('HandbookTemplate'),
			params = paramString.parseParams("anon")[0],
			space = params.space,
			title = params.title,
			image = params.image,
			language = params.language,
			pages = params.pages,
			topics = params.topics,
			mine = params.mine,
			host = window.location.host.split(".").splice(1).join(".");
		if(mine || !paramString) {
			$.ajax({
				url: '/spaces?mine=1',
				dataType: 'json',
				success: function(data) {
					var list = [],
						out,
						emptyString = "you do not have any handbooks";
						username = config.extensions.tiddlyweb.username;
					if(data && data.length) {
						$(data).each(function() {
							if(username !== this.name) {
								list.push('<li><a href="'+this.uri+'">'+this.name+'</a></li>');
							}
						});
						if(list.length) {
							out = "<ul>"+list.join("\n")+"</ul>";
						} else {
							out = emptyString;
						}
					} else {
						out = emptyString;
					}
					$(place).append(out);
				}
			});
		} else {
			out = '<div class="handbook">' +
				'<h3>'+title+'</h3>' +
				'<div class="imgContainer">' +
					'<div class="left">' +
						'<a href="http://'+space+"."+host+'"><img src="'+image+'" alt="'+title+'" /></a>' +
						'<!--<button>duplicate</button>-->' +
					'</div>' +
				'</div>' +
				'<div class="meta">' +
					'<p><strong>Language</strong>: '+language+'</p>' +
					'<p><strong>Pages</strong>: '+pages+'</p>' +
					'<p><strong>Topics</strong>: '+topics+'</p>' +
				'</div>' +
			'</div>';
			$(place).append(out);
		}
	}
};
/*}}}*/