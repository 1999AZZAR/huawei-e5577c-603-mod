var g_device_array=[],g_device_config={},g_device_info={},g_device_single="",g_device_mode_2g=0,g_device_mode_3g=2,g_device_mode_4g=7,g_device_mode=(g_device_single="","");String.prototype.addLeadZeroes=function(e){var _="";for(i=this.length;i<e;i++)_+="0";return _+this};var nc_cnt=0,prev_cnt=0;function getDeviceInfo(){var e="";getAjaxData("devicename.cgi",(function(_){var i=xml2object(_);"response"==i.type&&null!=i.response.DeviceName&&(e=i.response.DeviceName)}),{sync:!0}),getAjaxData("api/monitoring/status",(function(e){var _=xml2object(e);"response"==_.type&&(G_MonitoringStatus=_)}),{sync:!0}),getAjaxData("api/device/signal",(function(e){var _=xml2object(e);"response"==_.type&&(g_device_single=_,g_device_mode=parseInt(g_device_single.response.mode,10))}),{sync:!0});var _="",i=void 0,n="";getAjaxData("api/net/signal-para",(function(e){var c=xml2object(e);"response"==c.type&&(i=c.response.Lac,null!=c.response.Rssi&&(_=c.response.Rssi),null!=c.response.CellID&&(n=c.response.CellID))}),{sync:!0});var c={};getConfigData("config/deviceinformation/add_param.xml",(function(e){var _=xml2object(e);if("config"==_.type&&null!=(c=_.config).cnt)if(cnt=parseInt(c.cnt),cnt!=prev_cnt)nc_cnt=0,prev_cnt=cnt;else if(nc_cnt+1==5)for(p in c)c[p]="";else nc_cnt++}),{sync:!0});var s="";getConfigData("config/version.xml",(function(e){var _=xml2object(e);void 0!==_.config.webui&&(s=_.config.webui)}),{sync:!0}),null!=i&&""!=i||null==c.lac||""==c.lac||(i=c.lac),getAjaxData("api/device/information",(function(d){var a=xml2object(d);if("response"==a.type){g_device_info=a.response,""!=e&&(a.response.DeviceName=e),""!=s&&(g_device_info.WebUIVersion=s),void 0===a.response.WanIPAddress&&void 0===a.response.WanIPv6Address&&(g_device_info.WanIPAddress=G_MonitoringStatus.response.WanIPAddress,g_device_info.WanIPv6Address=G_MonitoringStatus.response.WanIPv6Address);var o=G_MonitoringStatus.response.PrimaryDns;""==o&&(o=common_unknown);var r=G_MonitoringStatus.response.SecondaryDns;if(""==r&&(r=common_unknown),g_device_info.PrimaryDns=o+" / "+r,""!=g_device_info.Iccid&&(g_device_info.Iccid=g_device_info.Iccid.replace("F","").replace("F","")),g_device_mode==g_device_mode_2g||g_device_mode==g_device_mode_3g||g_device_mode==g_device_mode_4g)var g=g_device_single.response.rssi;if(""==g&&""==(g=_)&&null!=c.rssi&&""!=(g=c.rssi)&&(g+="dBm"),g_device_info.rssi=g,g_device_mode==g_device_mode_3g&&(g_device_info.rscp=g_device_single.response.rscp,g_device_info.ecio=g_device_single.response.ecio,g_device_info.sc=g_device_single.response.sc),g_device_mode==g_device_mode_4g&&(g_device_info.rsrp=g_device_single.response.rsrp,g_device_info.rsrq=g_device_single.response.rsrq,g_device_info.sinr=g_device_single.response.sinr),g_device_mode==g_device_mode_2g||g_device_mode==g_device_mode_3g||g_device_mode==g_device_mode_4g){null!=i&&(""!=i&&(i+=" / "+parseInt("0x"+i)),g_device_info.lac=i);var t=0;null!=(g=g_device_single.response.cell_id)&&""!=g?g=Number(g).toString(16).toUpperCase().addLeadZeroes(7):""!=n?g=n:null!=c.cell_id&&(g=c.cell_id),""!=g&&(g=g_device_mode==g_device_mode_2g?g.slice(-4):g.slice(-7),g+=" / "+(t=parseInt("0x"+g))),g_device_info.cell_id=g,g_device_mode==g_device_mode_4g&&(g_device_info.enb=""!=g?(t>>8)+" / "+t%256:"")}if(g_device_mode==g_device_mode_4g){if(g_device_info.pci=g_device_single.response.pci,null!=c.band&&""!=c.band&&(g_device_info.band="B"+c.band),null!=c.earfcn1&&null!=c.earfcn2&&""!=c.earfcn1&&""!=c.earfcn2&&(g_device_info.earfcn=c.earfcn1+" / "+c.earfcn2),null!=c.freq1&&null!=c.freq2&&""!=c.freq1&&""!=c.freq2){var v=parseInt(c.freq1)/10,l=parseInt(c.freq2)/10;g_device_info.freq=v.toFixed(1)+" / "+l.toFixed(1)+" MHz"}null!=c.bandwidth1&&null!=c.bandwidth2&&""!=c.bandwidth1&&""!=c.bandwidth2&&(v=parseInt(c.bandwidth1)/1e3,l=parseInt(c.bandwidth1)/1e3,g_device_info.bandwidth=v+" / "+l+" MHz")}}}),{sync:!0})}function getDeviceConfig(){getConfigData("config/deviceinformation/config.xml",(function(e){var _=_xml2feature(e);"undefined"!==_&&null!==_&&(g_device_config=_)}),{sync:!0})}function createListForDevice(e,_){var i="",n=common_unknown,c="";switch(e){case"DeviceName":i=system_label_device_name;break;case"SerialNumber":i=system_label_serial_number;break;case"Imei":g_net_mode_status==MACRO_NET_MODE_W&&""!=g_device_info.Imei&&(i=system_label_imei);break;case"Imsi":i=device_information_imsi;break;case"HardwareVersion":i=system_label_hardware_version;break;case"SoftwareVersion":i=system_label_software_version;break;case"WebUIVersion":i=system_label_webui_version;break;case"MacAddress1":i=wlan_label_lan_mac_address;break;case"MacAddress2":""!=g_device_info.MacAddress2&&(i=wlan_label_wan_mac_address);break;case"Iccid":i=system_label_iccid;break;case"Msisdn":i=system_label_my_number;break;case"ProductFamily":i=system_label_product_family;break;case"Classify":i=system_label_classify;break;case"WanIPAddress":i=system_label_wanip_address;break;case"PrimaryDns":i="DNS 1 / DNS 2";break;case"SecondaryDns":default:break;case"Esn":g_net_mode_status==MACRO_NET_MODE_C&&""!=g_device_info.Esn&&(i=system_label_esn);break;case"Meid":g_net_mode_status==MACRO_NET_MODE_C&&""!=g_device_info.Esn&&"8"==g_device_info.Esn.charAt(0)&&"0"==g_device_info.Esn.charAt(1)&&(i=system_label_meid);break;case"WanIPv6Address":i=system_label_wan_IPv6_addr;break;case"pci":g_device_mode==g_device_mode_4g&&(i=IDS_system_label_pci);break;case"sc":g_device_mode==g_device_mode_3g&&(i=IDS_system_label_sc);break;case"lac":i="LAC (hex/dec)";break;case"cell_id":g_device_mode!=g_device_mode_2g&&g_device_mode!=g_device_mode_3g&&g_device_mode!=g_device_mode_4g||(i="Cell ID (hex/dec)");break;case"enb":g_device_mode==g_device_mode_4g&&(i="eNB / Cell");break;case"rsrq":g_device_mode==g_device_mode_4g&&(i=IDS_system_label_rsrq);break;case"rsrp":g_device_mode==g_device_mode_4g&&(i=IDS_system_label_rsrp);break;case"rssi":g_device_mode!=g_device_mode_2g&&g_device_mode!=g_device_mode_3g&&g_device_mode!=g_device_mode_4g||(i=IDS_system_label_rssi);break;case"sinr":g_device_mode==g_device_mode_4g&&(i=IDS_system_label_sinr);break;case"rscp":g_device_mode==g_device_mode_3g&&(i=IDS_system_label_rscp);break;case"ecio":g_device_mode==g_device_mode_3g&&(i="Ec/Io");break;case"band":g_device_mode==g_device_mode_4g&&(i=IDS_system_label_band);break;case"earfcn":g_device_mode==g_device_mode_4g&&(i="EARFCN (Down/Up)");break;case"freq":g_device_mode==g_device_mode_4g&&(i="Frequency (Down/Up)");break;case"bandwidth":g_device_mode==g_device_mode_4g&&(i="Bandwidth (Down/Up)")}return""==i?c:c=i==system_label_my_number||i==wlan_label_lan_mac_address||i==wlan_label_wan_mac_address?"<tr><td>"+i+common_colon+"</td><td class='info_value success_phone_number'>"+(""==_?n:_)+"</td></tr>":"<tr><td>"+i+common_colon+"</td><td class='info_value'>"+(""==_?n:_)+"</td></tr>"}function setDeviceDisplay(e,_){var i="",n="";for(n in _)e[n.toLowerCase()]&&"undefinded"!=typeof _[n]&&(i+=createListForDevice(n,_[n]));$(".diviceInfo_table").html(i)}function updateDeviceInfo(){g_net_mode_change==MACRO_NET_MODE_CHANGE&&(getDeviceInfo(),setDeviceDisplay(g_device_config,g_device_info),resetNetModeChange())}function updateDeviceInfo_(){getDeviceInfo(),setDeviceDisplay(g_device_config,g_device_info),setTimeout(updateDeviceInfo_,3e3)}getDeviceConfig(),$(document).ready((function(){updateDeviceInfo_(),g_net_mode_type==MACRO_NET_DUAL_MODE&&addStatusListener("updateDeviceInfo ()"),$("#refresh").bind("click",(function(){getDeviceInfo(),setDeviceDisplay(g_device_config,g_device_info)})),$("#refresh_button").hide()}));
