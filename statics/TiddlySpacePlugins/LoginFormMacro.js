/*{{{*/
config.macros.loginform = {
	handler: function(place) {
		config.extensions.tiddlyweb.getUserInfo(function(user) {
			var templateName = user.anon ? "LoginFormTemplate" : "LogoutFormTemplate",
				html = store.getRecursiveTiddlerText(templateName),
				$ = jQuery,
				$form = $(place).attr('id','loginForm')
					.append(html)
					.find('form');
			if(user.anon) {
				$form.submit(function() {
					var $form = $(this),
						usernameField = $(this).find("input[name=username]"),
						username = usernameField.val(),
						password = $(this).find("input[name=password]").val(),
						tsl = config.macros.TiddlySpaceLogin;
					tsl.login(username, password, function() {
						tsl.redirect();
					}, function() {
						usernameField.val("Error!");
					});
					return false;
				}).click(function() {
					$(this).find('input[name=username]').select();
				});
			} else {
				if(!readOnly) {
					$('html').addClass('can-edit');	
				}
				$form.submit(function() {
					var csrf_token = config.extensions.tiddlyspace.getCSRFToken();
					$form.append('<input type="hidden" name="csrf_token" value="'+csrf_token+'" />')
					return true;
				});
			}
		});
	}
};
/*}}}*/