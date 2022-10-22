function initPageData() {
	if(user_config.watchcat_mode == 'allways')
		user_config.watchcat_mode = 'always';

	getModSettingsData('modsettings', modsettings);
	getModSettingsData('user_config', user_config);
}

function postData() {
	button_enable('apply_button', '0');
	setModSettings(modsettings);
	applyModSettings(function(data, textStatus, jqXHR) {
		if (isAjaxReturnOK(data))
			showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments, function() {});
		else {
			showInfoDialog(common_failed);
			initPageData();
		}
	});
}


function apply() {
	if (!isButtonEnable('apply_button'))
	{
	    return;
	}
	showConfirmDialog(system_hint_operation_restart_device, postData, function() {});
}

$(document).ready(function() {
	initPageData();

	button_enable('apply_button', '0');

	$('#apply_button').click(function() {
		apply();
	});
});
