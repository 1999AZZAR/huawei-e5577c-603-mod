var g_appmanagement = null;
var g_language = null;
var domestic = null;
var foreign = null;
var windowsOS = null;
var macOS = null;
var linuxOS =null;
var archlinuxOS = null;
var debianGNULinuxOS = null;
var appImage32ForLinuxOS = null;
var appImage64ForLinuxOS = null;
var snapPackage32ForLinuxOS = null;
var snapPackage64ForLinuxOS = null;
var otherOS = null;
var numDoctor = 0;

function initAppPage() {
    getAjaxData('api/language/current-language', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_language = ret.response.CurrentLanguage;
        }
    }, {
        sync: true
    });
    getConfigData('config/global/config.xml', function($xml) {
        var g_feature = _xml2feature($xml);
        g_appmanagement = g_feature.appmanagements;
        domestic = $.trim(g_appmanagement.hilink.domestic);
        foreign = $.trim(g_appmanagement.hilink.foreign);
        windowsOS = $.trim(g_appmanagement.mobileDoctor.windowsOS);
        macOS = $.trim(g_appmanagement.mobileDoctor.macOS);
        linuxOS = $.trim(g_appmanagement.mobileDoctor.linuxOS);
        archlinuxOS = $.trim(g_appmanagement.mobileDoctor.archlinuxOS);
        debianGNULinuxOS = $.trim(g_appmanagement.mobileDoctor.debianGNULinuxOS);
        appImage32ForLinuxOS = $.trim(g_appmanagement.mobileDoctor.appImage32ForLinuxOS);
        appImage64ForLinuxOS = $.trim(g_appmanagement.mobileDoctor.appImage64ForLinuxOS);
        snapPackage32ForLinuxOS = $.trim(g_appmanagement.mobileDoctor.snapPackage32ForLinuxOS);
        snapPackage64ForLinuxOS = $.trim(g_appmanagement.mobileDoctor.snapPackage64ForLinuxOS);
        otherOS = $.trim(g_appmanagement.mobileDoctor.otherOS);
    }, {
        sync: true
    });
    if(g_language == "zh-cn") {
        $("#domestic_address").show();
    } else {
        $("#foreign_address").show();
    }
    if(g_language == "zh-cn") {
        document.getElementById("app_href_address").href = domestic;
        $("#app_span").text(domestic);
    } else {
        document.getElementById("app_href_address").href = foreign;
        $("#app_span").text(foreign);
    }
    if(g_language == "zh-cn") {
        linuxOS = linuxOS.replace('/en/','/cn/');
        macOS =  macOS.replace('/en/','/cn/');
        windowsOS = windowsOS.replace('/en/','/cn/');
    }
    document.getElementById("Linux_href_address").href = linuxOS;
    $("#Linux_span").text(linuxOS);
    document.getElementById("Arch_Linux_href_address").href = archlinuxOS
    $("#Arch_Linux_span").text(archlinuxOS);
    document.getElementById("Debian_GNU_Linux_href_address").href = debianGNULinuxOS;
    $("#Debian_GNU_Linux_span").text(debianGNULinuxOS);
    document.getElementById("AppImage32_href_address").href = appImage32ForLinuxOS;
    $("#AppImage32_span").text(appImage32ForLinuxOS);
    document.getElementById("AppImage64_href_address").href = appImage64ForLinuxOS;
    $("#AppImage64_span").text(appImage64ForLinuxOS);
    document.getElementById("Snap32_href_address").href = snapPackage32ForLinuxOS;
    $("#Snap32_span").text(snapPackage32ForLinuxOS);
    document.getElementById("Snap64_href_address").href = snapPackage64ForLinuxOS;
    $("#Snap64_span").text(snapPackage64ForLinuxOS);
    document.getElementById("MAC_href_address").href = macOS;
    $("#MAC_span").text(macOS);
    document.getElementById("Windows_href_address").href = windowsOS;
    $("#Windows_span").text(windowsOS);
    document.getElementById("Other_href_address").href = otherOS;
    $("#Other_span").text(otherOS);
}

function judgeDoctorStatus() {
    if(windowsOS.length > 0) {
        $("#app_doctor_windows").show();
        numDoctor += 1;
    }
    if(macOS.length > 0) {
        $("#app_doctor_mac").show();
        numDoctor += 1;
    }
    if(linuxOS.length > 0) {
        $("#app_doctor_linux").show();
        numDoctor += 1;
    }
    if(archlinuxOS.length > 0) {
        $("#app_doctor_arch_linux").show();
        numDoctor += 1;
    }
    if(debianGNULinuxOS.length > 0) {
        $("#app_doctor_debian_gnu_linux").show();
        numDoctor += 1;
    }
    if(appImage32ForLinuxOS.length > 0) {
        $("#app_doctor_appimage32").show();
        numDoctor += 1;
    }
    if(appImage64ForLinuxOS.length > 0) {
        $("#app_doctor_appimage64").show();
        numDoctor += 1;
    }
    if(snapPackage32ForLinuxOS.length > 0) {
        $("#app_doctor_snap32").show();
        numDoctor += 1;
    }
    if(snapPackage64ForLinuxOS.length > 0) {
        $("#app_doctor_snap64").show();
        numDoctor += 1;
    }
    if(otherOS.length > 0) {
        $("#app_doctor_other").show();
        numDoctor += 1;
    }
    if(numDoctor == 0) {
        $("#app_doctor_all").hide();
    }
}

$(document).ready( function() {
    initAppPage();
    judgeDoctorStatus();
});
