$(function() {
	$('form#uploadForm').submit(function(e) {
		e.preventDefault();
		var formData = new FormData($('form#uploadForm')[0]);

		$.ajax({
			url: 'http://localhost:8080/api/UploadPresentation',
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
				if (!data.success) {
					console.log("ERROR: Not Logged In!");
				} else {
					console.log("SUCCESS", data, status);
				}
			},
			error: function(jqXHR, status, error) {
				console.log("ERROR", status, error);
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