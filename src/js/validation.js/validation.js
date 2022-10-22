var CHARCODE_A=65,CHARCODE_F=70,CHARCODE_Z=90,CHARCODE_a=97,CHARCODE_f=102,CHARCODE_z=122,CHARCODE_0=48,CHARCODE_9=57,CHARCODE_DOT=46,CHARCODE_UNDERLINE=95,CHARCODE_SPACE=32,CHARCODE_DASH=45,MIN_PORT_RANGE=1,MAX_PORT_RANGE=65535,FILTER_DISABLED=0,FILTER_ENABLED=1,PROTOCOL_BOTH=0,PROTOCOL_IMCP=1,PROTOCOL_TCP=6,PROTOCOL_UDP=17;function isValidIpAddress(r){var t=r.split(".");if(4!=t.length)return!1;for(i=0;i<4;i++){if(1==isNaN(t[i]))return!1;if(""==t[i])return!1;if(-1!=t[i].indexOf(" "))return!1;if(0==t[i].indexOf("0")&&1!=t[i].length)return!1}return!(t[0]<=0||127==t[0]||t[0]>223||t[1]<0||t[1]>255||t[2]<0||t[2]>255||t[3]<=0||t[3]>=255)}function validStaticIp(r){var t=r.split(".");if(4!=t.length)return!1;for(i=0;i<4;i++){if(1==isNaN(t[i]))return!1;if(""==t[i])return!1;if(-1!=t[i].indexOf(" "))return!1;if(0==t[i].indexOf("0")&&1!=t[i].length)return!1}return!(t[0]<=0||127==t[0]||t[0]>223||t[1]<0||t[1]>255||t[2]<0||t[2]>255||t[3]<0||t[3]>255)}function obverseMask(r,t){var e="",n="",a=r.split("."),_=t.split(".");for(i=0;i<4;i++)e+=255-Number(_[i])&Number(a[i]),e+=".",n+=255-Number(_[i]),n+=".";return e=e.substring(0,e.length-1),n=n.substring(0,n.length-1),"0.0.0.0"!=e&&e!=n}function isValidMacAddress(r){var t="",i=0,e=0,n=new Array("1","3","5","7","9","b","d","f");if("ff:ff:ff:ff:ff:ff"==r)return!1;var a=r.split(":");if(6!=a.length)return!1;for(i=0;i<6;i++){if(2!=a[i].length)return!1;for(e=0;e<a[i].length;e++)if(!((t=a[i].toLowerCase().charAt(e))>="0"&&t<="9"||t>="a"&&t<="f"))return!1}for(t=a[0].toLowerCase().charAt(1),i=0;i<n.length;i++)if(t==n[i])return!1;return!0}function isValidSubnetMask(r){var t=0,i=0,e=0,n=!1;if("0.0.0.0"==r)return!1;if("255.255.255.255"==r)return!1;var a=r.split(".");if(4!=a.length)return!1;for(t=0;t<4;t++){if(1==isNaN(a[t]))return!1;if(""==a[t])return!1;if(-1!=a[t].indexOf(" "))return!1;if(0==a[t].indexOf("0")&&1!=a[t].length)return!1;if((i=parseInt(a[t],10))<0||i>255)return!1;if(1==n&&0!=i)return!1;if((e=getLeftMostZeroBitPos(i))<getRightMostOneBitPos(i))return!1;e<8&&(n=!0)}return!0}function isBroadcastOrMulticastIp(r){var t;return t=inetAton(r),4294967295==(t>>>=0)||t>=3758096384&&t<=4026531839}function isPrivateIp(r){var t;return t=inetAton(r),(t>>>=0)>=2684354560&&t<=2701131775||t>=2886729728&&t<=2887778303||t>=3232235520&&t<=3232301055}function portPartsParse(r){var t=[];return-1==(r=$.trim(r)).indexOf("-")?t=[r,r]:(r=r.split("-"),t=[$.trim(r[0]),$.trim(r[1])]),t}function portJoin(r,t){var i=$.trim(r),e=$.trim(t);return""==i||""==e||i==e?r:r+"-"+t}function inetAton(r){var t;return 4!=(t=r.split(/\./)).length?0:t[0]<<24|t[1]<<16|t[2]<<8|t[3]}function getLeftMostZeroBitPos(r){var t=0,i=[128,64,32,16,8,4,2,1];for(t=0;t<i.length;t++)if(0==(r&i[t]))return t;return i.length}function getRightMostOneBitPos(r){var t=0,i=[1,2,4,8,16,32,64,128];for(t=0;t<i.length;t++)if((r&i[t])>>t==1)return i.length-t-1;return-1}function compareStartIpAndEndIp(r,t){var e=r.split("."),n=t.split(".");for(i=0;i<4&&!(parseInt(n[i],10)>parseInt(e[i],10));i++)if(parseInt(n[i],10)!=parseInt(e[i],10)||3==i)return!1;return!0}function isSameSubnetAddrs(r,t,e){var n=r.split("."),a=t.split("."),_=e.split(".");for(i=0;i<4;i++)if((Number(n[i])&Number(_[i]))!=(Number(a[i])&Number(_[i])))return!1;return!0}function IsIpInRange(r,t,i){var e,n,a;return e=inetAton(r),e>>>=0,n=inetAton(t),n>>>=0,a=inetAton(i),a>>>=0,e>=n&&e<=a}function isBroadcastOrNetworkAddress(r,t){var i,e,n;return(n=(i=inetAton(r))&(e=inetAton(t)))!=i&&i!=(n|~e)}function isVaildSpecialPort(r,t){var i=$.trim(r),e="",n=0;if(""==i)return showQtip(t,firewall_hint_port_empty),!1;if(0==i.indexOf("0")&&1!=i.length)return showQtip(t,firewall_hint_port_empty),!1;for(n=0;n<i.length;n++)if(!((e=i.toLowerCase().charAt(n))>="0"&&e<="9"))return showQtip(t,firewall_hint_port_empty),!1;return!(i<MIN_PORT_RANGE||i>MAX_PORT_RANGE)||(showQtip(t,firewall_hint_port_number_valid_char),!1)}function isVaildPortForIPFilter(r,t){var i=$.trim(r);if(""==i)return showQtip(t,firewall_hint_port_empty),!1;if(r<MIN_PORT_RANGE||r>MAX_PORT_RANGE)return showQtip(t,firewall_hint_port_number_valid_char),!1;var e=portPartsParse(r),n=0;for(n=0;n<e.length;n++)if(isNaN(e[n]))return showQtip(t,firewall_hint_port_empty),!1;if(-1==(i=$.trim(r)).indexOf("-")){if(!isVaildSpecialPort(i,t))return!1}else{if(2!=(i=r.split("-")).length)return showQtip(t,firewall_hint_port_empty),!1;for(n=0;n<2;n++){if(1==isNaN(i[n]))return showQtip(t,firewall_hint_port_empty),!1;if(""==i[n])return showQtip(t,firewall_hint_port_empty),!1;if(!isVaildSpecialPort(i[n],t))return!1}if(parseInt(i[0],10)>parseInt(i[1],10))return showQtip(t,firewall_hint_start_greater_end_port),!1}return!0}function isHexString(r){for(i=0;i<r.length;i++){var t=r.charCodeAt(i);if(!(t>=CHARCODE_0&&t<=CHARCODE_9||t>=CHARCODE_A&&t<=CHARCODE_F||t>=CHARCODE_a&&t<=CHARCODE_f))return!1}return!0}function isAsciiString(r){for(i=0;i<r.length;i++){var t=r.charCodeAt(i);if(t<=32||t>=127)return!1}return!0}function checkInputPPPoEChar(r){var t,i;if(""==r)return!0;for(t=0;t<r.length;t++)if((i=r.charAt(t).charCodeAt())>MACRO_SUPPORT_CHAR_MAX||i<MACRO_SUPPORT_CHAR_MIN)return!1;return!0}function checkInputCharNew(r){return/^[a-zA-Z0-9_]+$/.test(r)}function IsDigital(r){return!(null==r.match(/^[0-9]+$/))}function resolveXMLEntityReference(r){return r.replace(/(\<|\>|\&|\'|\"|\/|\(|\))/g,(function(r,t){return{"<":"&lt;",">":"&gt;","&":"&amp;","'":"&#39;",'"':"&quot;","/":"&#x2F;","(":"&#40;",")":"&#41;"}[t]}))}function XSS_UnescapesSpecialChar(r){return r.replace(/(&lt;|&gt;|&amp;|&#39;|&quot;|&#x2F;|&#40;|&#41;)/g,(function(r,t){return{"&lt;":"<","&gt;":">","&amp;":"&","&#39;":"'","&quot;":'"',"&#x2F;":"/","&#40;":"(","&#41;":")"}[t]}))}function hasSpaceOrTabAtHead(r){return 0==r.indexOf(" ")||0==r.indexOf("\t")}function validateSsid(r){var t=common_ok;if(0==r.length)t=wlan_hint_ssid_empty;else if(hasSpaceOrTabAtHead(r))t=input_cannot_begin_with_space;else if(32<r.length)t=wizard_help_name_ssid;else for(i=0;i<r.length;i++){var e=r.charAt(i);e>="a"&&e<="z"||e>="A"&&e<="Z"||e>="0"&&e<="9"||"-"!=e&&"_"!=e&&"."!=e&&" "!=e&&(t=wlan_hint_ssid_valid_char)}return t}function wispr_validInput(r,t,i){var e=!0,n="";return clearAllErrorLabel(),""==r.Username?(e=!1,n=t,errMsg=settings_hint_user_name_empty):0==checkInputChar(r.Username)?(e=!1,n=t,errMsg=dialup_hilink_hint_username_invalidate):""==r.Password?(e=!1,n=i,errMsg=dialup_hint_password_empty):0==checkInputChar(r.Password)&&(e=!1,n=i,errMsg=dialup_hilink_hint_password_invalidate),e||showErrorUnderTextbox(n,errMsg),$("#"+n).focus(),$("#"+n).select(),e}function checkWifiSecurity(r,t,i){var e=t;return clearAllErrorLabel(),SECURITY_MODE_WPA_PSK==e||SECURITY_MODE_WPA2_PSK==e||SECURITY_MODE_WPA_WPA2_PSK==e?checkWpaPwd(r,i):SECURITY_MODE_WEP!=e||checkNWepKeyPwd(r,i)}function checkNWepKeyPwd(r,t){var i=r,e=null,n=!1;return 0==i.length?e=dialup_hint_password_empty:hasSpaceOrTabAtHead(i)?e=input_cannot_begin_with_space:10==i.length||26==i.length?isHexString(i)?n=!0:e=wifi_hint_64_or_128_bit_key:5==i.length||13==i.length?checkInputChar(i)?n=!0:e=wlan_hint_wep_key_valid_type:e=wifi_hint_64_or_128_bit_key,n||("wifi_password"==t?showErrorUnderTextField(t,e):showErrorUnderTextbox(t,e),$("#"+t).focus(),$("#"+t).select()),n}function checkWpaPwd(r,t){var i=r,e=null,n=!1;return 0==i.length?e=dialup_hint_password_empty:hasSpaceOrTabAtHead(i)?e=input_cannot_begin_with_space:64==i.length?isHexString(i)?n=!0:e=wifi_hint_wps_psk_valid_type:i.length>=8&&i.length<=63?checkInputChar(i)?n=!0:e=wlan_hint_wps_psk_valid_char:e=wifi_hint_wps_psk_valid_type,n||("wifi_password"==t?showErrorUnderTextField(t,e):showErrorUnderTextbox(t,e),$("#"+t).focus(),$("#"+t).select()),n}function isWanAbcIpAddress(r){if(0==isValidIpAddress(r))return!1;var t,i=r.split(".");return!((t=parseInt(i[0],10))<1||t>=224||127==t)}function checkInputSsidPasswordValid(r){var t,i;if(""==r)return!0;for(t=0;t<r.length;t++)if((i=r.charAt(t).charCodeAt())>MACRO_SUPPORT_CHAR_MAX||i<MACRO_SUPPORT_CHAR_MIN)return!1;return!0}function checkInputSsidNameValid(r,t){var i,e,n=common_ok,a=/[\u4e00-\u9fa5]/,_=0,s=32,u=0;for(0==t.length&&(n=wlan_hint_ssid_empty),i=0;i<t.length;i++){var o=t.charAt(i),f=a.test(o);if((e=o.charCodeAt())<=MACRO_SUPPORT_CHAR_MAX&&e>=MACRO_SUPPORT_CHAR_MIN?(_++,u++):f?((_+=3)<=32&&(s-=2),u++):n=wlan_hint_ssid_valid_char_cn,$("#"+r).attr("maxlength",s),_>32){u--,$("#"+r).val(t.substr(0,u));break}}return n}String.prototype.trimWhitespace=function(){return this.replace(/(^\s*)|(\s*$)/g,"")};
