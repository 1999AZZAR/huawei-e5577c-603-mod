function initPageData() {
	if(typeof(modsettings.fix_ttl) != 'undefined' && modsettings.fix_ttl.length > 0)
		delete user_config.fix_ttl;
	var devicename = "";
	getAjaxData('devicename.cgi', function($xml) {
		var ret = xml2object($xml);
		if (ret.type == 'response') {
			if (ret.response.DeviceName != undefined)
				devicename = ret.response.DeviceName;
		}
	}, {
		sync: true
	});
	getAjaxData('platform.cgi', function($xml) {
		var ret = xml2object($xml);
		if (ret.type == 'response') {
			if(ret.response.platform.indexOf('V7R11') != -1 || ret.response.platform.indexOf('V711') != -1 || ret.response.platform.indexOf('V7R2') != -1 || ret.response.platform.indexOf('V72') != -1) {
				$('#autoswitch').find('option[value="5"]').remove();
				$('#backup_imei').find('option[value="nvbackup"], option[value="factory-nvbackup"]').remove();
			} else if(ret.response.platform == 'Unknown') { //On V7R1 we can't access to ptable, so if we can't read ptable, then we believe that it is an old device (V7R1 and older)
				$('#autoswitch').find('option[value="3"], option[value="4"]').remove();
				$('#backup_imei').find('option[value="inforbu"], option[value="factory-inforbu"], option[value="backup_imei"]').remove();
			}
		}
	}, {
		sync: true
	});
	getAjaxData('api/device/information', function($xml) {
		var device_ret = xml2object($xml);
		if (device_ret.type == 'response') {
			if(devicename != "")
				device_ret.response.DeviceName = devicename;
			if(device_ret.response.DeviceName.indexOf('E3372S') != -1) {
				$('#tr_autoswitch').attr('id', 'tr_e3372s_autoswitch');
				$('#autoswitch').attr('id', 'e3372s_autoswitch');
				$('#e3372s_autoswitch').find('option[value="1"]').text(modsettings_label_autoswitch_modes_debug_rndis);
				$('#e3372s_autoswitch').find('option[value="2"]').text(modsettings_label_autoswitch_modes_debug_cdc);
				$('#e3372s_autoswitch').find('option[value="3"]').text(modsettings_label_autoswitch_modes_first_composition);
				$('#e3372s_autoswitch').find('option[value="4"]').remove();
				if(typeof(modsettings.autoswitch) != 'undefined') {
					modsettings.e3372s_autoswitch = modsettings.autoswitch;
					delete modsettings.autoswitch;
				}
			}
			if(modsettings.serial_number == '')
				modsettings.serial_number = device_ret.response.SerialNumber;
			if(modsettings.imei == '')
				modsettings.imei = device_ret.response.Imei;
			if(modsettings.msisdn == '')
				modsettings.msisdn = device_ret.response.Msisdn;
		}
	}, {
		sync: true
	});
	if(modsettings.imei_generator == '') {
		getIMEIGenerator(user_config.imei_generator_model, function(imei) {
			modsettings.imei_generator = imei;
			getModSettingsData('modsettings', modsettings);
			getModSettingsData('user_config', user_config);
		});
	} else {
		getModSettingsData('modsettings', modsettings);
		getModSettingsData('user_config', user_config);
	}
}

function getIMEIGenerator(model, callback) {
	$.ajax({
		type: "GET",
		url: "http://" + location.hostname + ":5080/cgi-bin/imei_generator.cgi?" + model,
		success: function(data, textStatus, jqXHR) {
			if (typeof(data.response) != 'undefined')
				if (typeof(data.response.imei_generator) != 'undefined')
					if(typeof(callback) == 'function')
						callback(data.response.imei_generator);
		},
		dataType: "json"
	});
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

	$('#imei_generator_model').live('change input paste cut keyup', function(e) {
		if(MACRO_KEYCODE != e.keyCode){
			getIMEIGenerator($(this).val(), function(imei) {
				modsettings.imei_generator = imei;
				$('#imei_generator').val(imei);
			});
		}
	});
	button_enable('apply_button', '0');

	$('#apply_button').click(function() {
		apply();
	});
});
