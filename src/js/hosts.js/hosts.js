function initPageData() {
	$.ajax({
		type: "GET",
		url: "/resident.conf",
		success: function(data, textStatus, jqXHR) {
			$('#resident').val(data);
		},
		dataType: "text",
		async: false
	});
}

function apply() {
	if (!isButtonEnable('apply_button'))
	{
	    return;
	}
	button_enable('apply_button', '0');
	$.ajax({
		type: "POST",
		url: "http://" + location.hostname + ":5080/cgi-bin/hosts.cgi?cmd=save_config",
		data: $('#resident').val(),
		processData: false,
		success: function(data, textStatus, jqXHR) {
			var ret = xml2object($(data));
			if (isAjaxReturnOK(ret))
				showInfoDialog(common_success);
			else {
				showInfoDialog(common_failed);
				initPageData();
			}
		},
		dataType: "xml",
		async: false
	});
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
