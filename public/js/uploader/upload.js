$(function() {
	$('form#uploadForm').submit(function(e) {
		e.preventDefault();
		var formData = new FormData($('form#uploadForm')[0]);

		$.ajax({
			url: '/api/UploadPresentation',
			type: 'POST',
			xhr: function() {
				var presXhr = $.ajaxSettings.xhr();
				if (presXhr.upload) {
					presXhr.upload.addEventListener('progress', progressHandler, false);
				}
				return presXhr;
			},
			beforeSend: function() {
				$('progress').show();
			},
			success: function(data, status,jqXHR) {
				data = JSON.parse(data);
				console.log("STATUS: " + data, status);
				if (data.success == true) {
					var presentationURL = "/presenter#" + data.data.id;
					window.location.replace(presentationURL);
				} else {
					alert("Failed to upload.");
				}
			},
			error: function(jqXHR, status, error) {
				alert("ERROR", status, error);
			},
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
		return false;
	});

	function progressHandler(e) {
		if (e.lengthComputable) {
			$('progress').attr({value: e.loaded, max:e.total});
		}
	}
});