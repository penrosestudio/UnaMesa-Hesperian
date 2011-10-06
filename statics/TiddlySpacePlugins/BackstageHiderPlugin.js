/*{{{*/
config.options.chkBackstage = false;
jQuery(document).bind("startup", function() {
	//jQuery('#backstageButton').empty();
	jQuery('#advancedMode').click(function() {
		backstage.isVisible() ? backstage.hide() : backstage.show();
		return false;
	});
});
/*}}}*/