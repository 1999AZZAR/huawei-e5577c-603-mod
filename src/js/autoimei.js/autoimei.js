function initPageData() {
	getModSettingsData('modsettings', modsettings);
	getModSettingsData('user_config', user_config);
	$.ajax({
		type: "GET",
		url: "/autoimei.conf",
		success: function(data, textStatus, jqXHR) {
			$('#autoimei_config').val(data);
		},
		dataType: "text",
		async: false
	});
}

function postData() {
	button_enable('apply_button', '0');
	$.ajax({
		type: "POST",
		url: "http://" + location.hostname + ":5080/cgi-bin/autoimei.cgi?cmd=save_config",
		data: $('#autoimei_config').val(),
		processData: false,
		success: function(data, textStatus, jqXHR) {
			var ret = xml2object($(data));
			if (isAjaxReturnOK(ret)) {
				setModSettings(modsettings);
				applyModSettings(function(data, textStatus, jqXHR) {
					if (isAjaxReturnOK(data))
						showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments, function() {});
					else {
						showInfoDialog(common_failed);
						initPageData();
					}
				});
			} else {
				showInfoDialog(common_failed);
				initPageData();
			}
		},
		dataType: "xml",
		async: false
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

    $('textarea').bind('change input paste cut keydown', function(e) {
        button_enable('apply_button', '1');
    });
	button_enable('apply_button', '0');

	$('#apply_button').click(function() {
		apply();
	});
});
