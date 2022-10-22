var modsettings_changed = false;

function getModSettingsData(dataName, data) {
	$.each(data, function(n, subValue) {
		if(typeof(subValue) != 'undefined' && ($('#tr_' + n).length > 0 || $('#' + n).length > 0)) {
			$('#tr_' + n).show();
			if($('#' + n).is('span'))
				$('#' + n).text(subValue);
			else if($('#' + n).is('input[type="checkbox"]'))
				$('#' + n).attr('checked', subValue == 'true');
			else if($('#' + n).is('input[type="file"]'))
				data[n] = null;
			else
				$('#' + n).val(subValue);
			$('#' + n).attr('data-' + dataName, true);
			if($('#' + n).is('select') && !($('#' + n).find('option[value="' + subValue + '"]').length > 0) && subValue != '')
				$('#' + n).replaceWith('<input id="' + n + '" data-' + dataName + '="true" type="text" size="25" value="' + subValue + '"/>');
		}
	});
}

function postUserConfig(successDialog, reload, callback) {
	saveUserConfig(user_config, function(data, textStatus, jqXHR) {
		var ret = xml2object($(data));
		if(isAjaxReturnOK(ret)) {
			if(successDialog !== false)
				showInfoDialog(common_success);
			if(typeof(callback) == 'function')
				callback(data, textStatus, jqXHR);
		} else {
			showInfoDialog(common_failed);
			initPageData();
		}
		if(reload === true)
			setTimeout("location.reload(true)", 3000);
	});
}

function setModSettings(settings, callback) {
	$.each(settings, function(n, subValue) {
		if(subValue !== null) {
			$.ajax({
				type: "POST",
				url: "http://" + location.hostname + ":5080/cgi-bin/modsettings.cgi?cmd=set&mod=" + n,
				data: subValue,
				processData: false,
				success: function(data, textStatus, jqXHR) {
					if(typeof(callback) == 'function')
						callback(data, textStatus, jqXHR);
				},
				dataType: "json",
				async: false
			});
		}
	});
}

function applyModSettings(callback) {
	$.ajax({
		type: "GET",
		url: "http://" + location.hostname + ":5080/cgi-bin/modsettings.cgi?cmd=apply",
		success: function(data, textStatus, jqXHR) {
			if(typeof(callback) == 'function')
				callback(data, textStatus, jqXHR);
		},
		dataType: "json",
		async: false
	});

}

function saveUserConfig(config, callback) {
	$.ajax({
		type: "POST",
		url: "http://" + location.hostname + ":5080/cgi-bin/user_config.cgi?cmd=save_config",
		data: object2xml('config', config),
		processData: false,
		success: function(data, textStatus, jqXHR) {
			if(typeof(callback) == 'function')
				callback(data, textStatus, jqXHR);
		},
		dataType: "xml",
		async: false
	});
}

$(document).ready(function() {
	$('[data-modsettings="true"], [data-user_config="true"]').live('change input paste cut keydown blur', function(e) {
		if(MACRO_KEYCODE != e.keyCode){
			if($(this).is('select') && $($(this).get(0)[$(this).get(0).selectedIndex]).is('[data-other="true"]'))
					$(this).replaceWith('<input id="' + $(this).attr('id') + '" ' + ($(this).is('[data-modsettings="true"]') ? 'data-modsettings="true"' : '') + ' ' + ($(this).is('[data-user_config="true"]') ? 'data-user_config="true"' : '') + ' type="text" size="25" value="' + modsettings[$(this).attr('id')] + '"/>');
			else {
				if($(this).is('[data-modsettings="true"]') && e.type != 'focusout') {
					if($(this).is('input[type="checkbox"]')) {
						modsettings[$(this).attr('id')] = String($(this).prop('checked'));
						if($(this).is('[data-reboot="false"]')) {
							var modsettingsTMP = {};
							modsettingsTMP[$(this).attr('id')] = modsettings[$(this).attr('id')];
							showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments, function() {});
							setModSettings(modsettingsTMP, function(data, textStatus, jqXHR) {
								closeWaitingDialog();
								if (isAjaxReturnOK(data))
									showInfoDialog(common_success);
								else
									showInfoDialog(common_failed);
							});
						} else {
							button_enable('apply_button', '1');
						}
					} else if($(this).is('input[type="file"]')) {
						if(typeof($(this).prop('files')[0]) != 'undefined') {
							var fileReader = new FileReader();
							var input = this;
							fileReader.onload = function(e) {
								modsettings[$(input).attr('id')] = e.target.result.split(',')[1];
								if($(input).is('[data-reboot="false"]')) {
									var modsettingsTMP = {};
									modsettingsTMP[$(input).attr('id')] = modsettings[$(input).attr('id')];
									showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments, function() {});
									setModSettings(modsettingsTMP, function(data, textStatus, jqXHR) {
										closeWaitingDialog();
										if (isAjaxReturnOK(data))
											showInfoDialog(common_success);
										else
											showInfoDialog(common_failed);
									});
								} else {
									button_enable('apply_button', '1');
								}
							}
							fileReader.readAsDataURL($(input).prop('files')[0]);
						}
					} else {
						modsettings[$(this).attr('id')] = $(this).val();
						if($(this).is('[data-reboot="false"]')) {
							var modsettingsTMP = {};
							modsettingsTMP[$(this).attr('id')] = modsettings[$(this).attr('id')];
							showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments, function() {});
							setModSettings(modsettingsTMP, function(data, textStatus, jqXHR) {
								closeWaitingDialog();
								if (isAjaxReturnOK(data))
									showInfoDialog(common_success);
								else
									showInfoDialog(common_failed);
							});
						} else {
							button_enable('apply_button', '1');
						}
					}
					modsettings_changed = true;
				}
				if($(this).is('[data-user_config="true"]') && ($(this).is('input[type="text"]') && e.type == 'focusout' || (!$(this).is('input[type="text"]') && e.type != 'focusout'))) {
					if($(this).is('input[type="checkbox"]')) {
						user_config[$(this).attr('id')] = String($(this).prop('checked'));
						postUserConfig(!$(this).is('[data-modsettings="true"]'), $(this).is('[data-reload="true"]'));
					} else if($(this).is('input[type="file"]')) {
						if(typeof($(this).prop('files')[0]) != 'undefined') {
							var fileReader = new FileReader();
							var input = this;
							fileReader.onload = function(e) {
								user_config[$(input).attr('id')] = e.target.result.split(',')[1];
								postUserConfig(!$(input).is('[data-modsettings="true"]'), $(input).is('[data-reload="true"]'));
							}
							fileReader.readAsDataURL($(this).prop('files')[0]);
						}
					} else {
						user_config[$(this).attr('id')] = $(this).val();
						postUserConfig(!$(this).is('[data-modsettings="true"]'), $(this).is('[data-reload="true"]'));
					}
				}
			}
		}
	});
});
