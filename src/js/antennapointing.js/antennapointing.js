var CURRENT_NETWORK_NO_SERVICE = 0;
var SERVICE_DOMAIN_NO_SERVICE = 0;
var SERVICE_STATUS_AVAIABLE = 2;
var g_device_mode_2g = 0;
var g_device_mode_3g = 2;
var g_device_mode_4g = 7;

String.prototype.addLeadZeroes = function(digits) {
    var zeroes = "";
    for (i = this.length; i < digits; i++)
        zeroes += "0";
    return zeroes + this;
}

function promiseAjax(url) {
	return new Promise(function(resolve, reject) {
		getAjaxData(url, resolve, {
			errorCB: function(XMLHttpRequest, textStatus) {
				resolve($([XMLHttpRequest, textStatus]));
			}
		});
	});
}

function updateInfo() {
	var device_mode = '';
	var plmn = '';
	var operator = '';
	var lac = '';
	var cell_id_dec = '';
	var cell_id_hex = '';
	var rssi = '';
	var hardware = '';
	var device = '';
	var webui = '';

	promiseAjax('operator.cgi').then(function($xml) {
		var ret = xml2object($xml);
		if (ret.type == 'response') {
			if(ret.response.State) {
				if(ret.response.Numeric)
					plmn = ret.response.Numeric;
				if(ret.response.ShortName)
					operator = ret.response.ShortName;
				else if(ret.response.FullName)
					operator = ret.response.FullName;
			}
		}
	}).then(function() {
		if(!plmn || !operator) {
			return promiseAjax('api/net/current-plmn').then(function($xml) {
				var ret = xml2object($xml);
				if (ret.type == 'response') {
					if(ret.response.State) {
						if(ret.response.Numeric && !plmn)
							plmn = ret.response.Numeric;
						if(ret.response.ShortName && !operator)
							operator = ret.response.ShortName;
						else if(ret.response.FullName && !operator)
							operator = ret.response.FullName;
					}
				}
			});
		}
	}).then(function() {
		if (G_MonitoringStatus.response.CurrentNetworkTypeEx) {
			var connect_type = G_MonitoringStatus.response.CurrentNetworkTypeEx;
		} else {
			var connect_type = G_MonitoringStatus.response.CurrentNetworkType;
		}
		if (connect_type == CURRENT_NETWORK_NO_SERVICE ||
		G_MonitoringStatus.response.CurrentServiceDomain == SERVICE_DOMAIN_NO_SERVICE ||
		G_MonitoringStatus.response.ServiceStatus != SERVICE_STATUS_AVAIABLE) {
			$('#plmn').empty();
			$('#operator').text(dialup_label_no_service);
		} else if (plmn || operator) {
			$('#plmn').text(plmn);
			$('#operator').text(operator);
		} else {
			$('#plmn').empty();
			$('#operator').empty();
		}
	});

	promiseAjax('api/monitoring/status').then(function($xml) {
		var ret = xml2object($xml);
		if (ret.type == 'response') {
			G_MonitoringStatus = ret;
			getPlmn();
			$('#network_mode').text(g_net_mode);
		}
	});

	promiseAjax('api/device/signal').then(function($xml) {
		var ret = xml2object($xml);
		if (ret.type == 'response') {
			device_mode = ret.response.mode;
			if(ret.response.cell_id) {
				cell_id_dec = ret.response.cell_id;
				cell_id_hex = Number(ret.response.cell_id).toString(16).toUpperCase().addLeadZeroes(7);
			}
			if(ret.response.rssi) {
				rssi = ret.response.rssi;
			}
			if(device_mode == g_device_mode_4g) {
				$('#signal_table_name_1').text(IDS_system_label_rsrp);
				$('#signal_table_name_2').text(IDS_system_label_sinr);
				$('#signal_table_name_3').text(IDS_system_label_rsrq);
				if(ret.response.rsrp) {
					var rsrp = parseInt(ret.response.rsrp);
					if(rsrp >= -80)
						$('#signal_table_value_1').html('<span class="light-green-text">' + ret.response.rsrp + '</span>');
					else if(rsrp <= -80 && rsrp >= -90)
						$('#signal_table_value_1').html('<span class="green-text">' + ret.response.rsrp + '</span>');
					else if(rsrp <= -90 && rsrp >= -100)
						$('#signal_table_value_1').html('<span class="orange-text">' + ret.response.rsrp + '</span>');
					else if(rsrp <= -100)
						$('#signal_table_value_1').html('<span class="red-text">' + ret.response.rsrp + '</span>');
				} else
					$('#signal_table_value_1').empty();
				if(ret.response.sinr) {
					var sinr = parseInt(ret.response.sinr);
					if(sinr >= 20)
						$('#signal_table_value_2').html('<span class="light-green-text">' + ret.response.sinr + '</span>');
					else if(sinr >= 13 && sinr <= 20)
						$('#signal_table_value_2').html('<span class="green-text">' + ret.response.sinr + '</span>');
					else if(sinr >= 0 && sinr <= 13)
						$('#signal_table_value_2').html('<span class="orange-text">' + ret.response.sinr + '</span>');
					else if(sinr <= 0)
						$('#signal_table_value_2').html('<span class="red-text">' + ret.response.sinr + '</span>');
				} else
					$('#signal_table_value_2').empty();
				if(ret.response.rsrq) {
					var rsrq = parseInt(ret.response.rsrq);
					if(rsrq >= -10)
						$('#signal_table_value_3').html('<span class="light-green-text">' + ret.response.rsrq + '</span>');
					else if(rsrq <= -10 && rsrq >= -15)
						$('#signal_table_value_3').html('<span class="green-text">' + ret.response.rsrq + '</span>');
					else if(rsrq <= -15 && rsrq >= -20)
						$('#signal_table_value_3').html('<span class="orange-text">' + ret.response.rsrq + '</span>');
					else if(rsrq <= -20)
						$('#signal_table_value_3').html('<span class="red-text">' + ret.response.rsrq + '</span>');
				} else
					$('#signal_table_value_3').empty();
			} else if(device_mode == g_device_mode_3g) {
				$('#signal_table_name_1').text(IDS_system_label_rscp);
				$('#signal_table_name_2').text('Ec/Io');
				$('#signal_table_name_3').empty();
				if(ret.response.rscp) {
					var rscp = parseInt(ret.response.rscp);
					if(rscp >= -84)
						$('#signal_table_value_1').html('<span class="light-green-text">' + ret.response.rscp + '</span>');
					else if(rscp <= -84 && rscp >= -94)
						$('#signal_table_value_1').html('<span class="green-text">' + ret.response.rscp + '</span>');
					else if(rscp <= -94 && rscp >= -105)
						$('#signal_table_value_1').html('<span class="orange-text">' + ret.response.rscp + '</span>');
					else if(rscp <= -105)
						$('#signal_table_value_1').html('<span class="red-text">' + ret.response.rscp + '</span>');
				} else
					$('#signal_table_value_1').empty();
				if(ret.response.ecio) {
					var ecio = parseInt(ret.response.ecio);
					if(ecio >= -84)
						$('#signal_table_value_2').html('<span class="light-green-text">' + ret.response.ecio + '</span>');
					else if(ecio <= -84 && ecio >= -94)
						$('#signal_table_value_2').html('<span class="green-text">' + ret.response.ecio + '</span>');
					else if(ecio <= -94 && ecio >= -105)
						$('#signal_table_value_2').html('<span class="orange-text">' + ret.response.ecio + '</span>');
					else if(ecio <= -105)
						$('#signal_table_value_2').html('<span class="red-text">' + ret.response.ecio + '</span>');
				} else
					$('#signal_table_value_2').empty();
				$('#signal_table_value_3').empty();
			} else {
				$('#signal_table_name_1').empty();
				$('#signal_table_name_2').empty();
				$('#signal_table_name_3').empty();
				$('#signal_table_value_1').empty();
				$('#signal_table_value_2').empty();
				$('#signal_table_value_3').empty();
			}
		}
	}).then(function() {
		return promiseAjax('api/net/signal-para').then(function($xml) {
			var ret = xml2object($xml);
			if (ret.type == 'response') {
				if(ret.response.Lac) {
					lac = ret.response.Lac;
				}
				if(ret.response.CellID) {
					cell_id_dec = parseInt(ret.response.CellID, 16);
					cell_id_hex = ret.response.CellID;
				}
				if(ret.response.Rssi) {
					rssi = ret.response.Rssi;
				}
			}
		});
	}).then(function() {
		return promiseAjax('config/deviceinformation/add_param.xml').then(function($xml) {
			var ret = xml2object($xml);
			if (ret.type == 'config') {
				if(ret.config.lac) {
					lac = ret.config.lac;
				}
				if(ret.config.cell_id) {
					cell_id_dec = parseInt(ret.config.cell_id, 16);
					cell_id_hex = ret.config.cell_id;
				}
				if(ret.config.freq1 || ret.config.freq2) {
					$('#freq').text(parseInt(ret.config.freq1) / 10 + '/' + parseInt(ret.config.freq2) / 10);
				} else {
					$('#freq').empty();
				}
				if(ret.config.bandwidth1 || ret.config.bandwidth2) {
					$('#bandwidth').text(parseInt(ret.config.bandwidth1) / 1000 + '/' + parseInt(ret.config.bandwidth2) / 1000);
				} else {
					$('#bandwidth').empty();
				}
				if(ret.config.rssi) {
					rssi = ret.config.rssi + "dBm";
				}
			}
		});
	}).then(function() {
		if(lac) {
			$('#lac_dec').text(parseInt(lac, 16));
			$('#lac_hex').text(lac);
		} else {
			$('#lac_dec').empty();
			$('#lac_hex').empty();
		}

		if(cell_id_dec || cell_id_hex) {
			if(device_mode == g_device_mode_2g) {
				cell_id_hex = cell_id_hex.slice(-4);
			} else {
				cell_id_hex = cell_id_hex.slice(-7);
			}
			$('#cell_id_dec').text(cell_id_dec);
			$('#cell_id_hex').text(cell_id_hex);
			if(device_mode == g_device_mode_4g) {
				$('#enb').text((cell_id_dec >> 8) + '/' + cell_id_dec % 256);
			} else {
				$('#enb').empty();
			}
		} else {
			$('#cell_id_dec').empty();
			$('#cell_id_hex').empty();
			$('#enb').empty();
		}
		
		if(rssi) {
			$('#rssi').text(rssi);
		} else {
			$('#rssi').empty();
		}
	});

	promiseAjax('api/device/information').then(function($xml) {
		var ret = xml2object($xml);
		if (ret.type == 'response') {
			if(ret.response.DeviceName)
				device = ret.response.DeviceName;
			if(ret.response.HardwareVersion)
				hardware = ret.response.HardwareVersion;
			if(ret.response.SoftwareVersion)
				$('#firmware').text(ret.response.SoftwareVersion);
			else
				$('#firmware').empty();
			if(ret.response.WebUIVersion)
				webui = ret.response.WebUIVersion;
		}
	}).then(function() {
		return promiseAjax('devicename.cgi').then(function($xml) {
			var ret = xml2object($xml);
			if (ret.type == 'response') {
				if (ret.response.DeviceName)
					device = ret.response.DeviceName;
        	}
		});
	}).then(function() {
		if(device)
			$('#device').text(device);
		else
			$('#device').empty();

		return promiseAjax('config/version.xml').then(function($xml) {
			var ret = xml2object($xml);
			if (ret.type == 'config') {
				if(ret.config.webui)
					webui = ret.config.webui;
			}
		});
	}).then(function() {
		if(webui)
			$('#webui').text(webui);
		else
			$('#webui').empty();
	});
}

$(function() {
	setInterval(updateInfo, 250);

	$('#home_button').click(function() {
		gotoPageWithHistory(HOME_PAGE_URL);
	});
});
