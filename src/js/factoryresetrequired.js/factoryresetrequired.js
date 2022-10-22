function doFactoryReset() {
	clearDialog();
	showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
	var DEFAULT_GATEWAY_IP = '';
	getConfigData('config/lan/config.xml', function($xml) {
		var ret = xml2object($xml);
		if('config' == ret.type) {
			DEFAULT_GATEWAY_IP = ret.config.dhcps.ipaddress;
		}
	}, {
		sync: true
	});
	$.ajax({
		type: "GET",
		url: "http://" + location.hostname + ":5080/cgi-bin/factoryreset.cgi?cmd=do_reset",
		success: function(data, textStatus, jqXHR) {
			var xmlstr = xml2object(data);
			if(isAjaxReturnOK(xmlstr)) {
				ping_setPingAddress(DEFAULT_GATEWAY_IP);
				setTimeout(startPing, 50000);
			} else {
				closeWaitingDialog();
				showInfoDialog(common_failed);
				return false;
			}
		},
		dataType: "xml"
	});
}

$(function() {
	$('#button_factoryreset').bind('click', function() {
		if (!isButtonEnable('button_factoryreset')) {
			return;
		}
		button_enable('button_factoryreset', '0');        
		showConfirmDialog(system_hint_restore, doFactoryReset, function() {
			button_enable('button_factoryreset', '1');
		}, null, function() {
			button_enable('button_factoryreset', '1');
		});
		return false;
	});

    if(!factoryResetRequired) {
        gotoPageWithoutHistory(HOME_PAGE_URL + window.location.search);
    }
});
