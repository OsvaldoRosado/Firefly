$(function() {

	var filename;
	$('progress').hide();
	
	$.get("/api/getCurrentUserInfo?rand="+(new Date().getTime()),function(data) {
		data = JSON.parse(data);
		if(!data.success){
			window.location.replace("/");
		} else{
			$(".username").text(data.data.name);
		}
	});
	
	var dropzone = $(".presentationDropZone");
	dropzone.on('dragenter', function(e) {
		dropzone.toggleClass("highlight");
	});
	dropzone.on('dragleave', function(e) {
		dropzone.toggleClass('highlight');
	});
	dropzone.on('drop', function(e) {
		dropzone.addClass('highlight');
	});

	$("form#uploadForm input:file").change(function() {
		if ($(this).val()) {
			$(".presentationDropZoneText h1").html("Let's go!");
			filename = $(this).val().split('\\').pop();
			$(".presentationDropZoneText p").html(filename);
		} else {
			$(".presentationDropZoneText h1").html("Drop Presentation Here");
			$(".presentationDropZoneText p").html("Click to show file picker");
		}

	})

	$('form#uploadForm').submit(function(e) {
		e.preventDefault();
		var formData = new FormData($('form#uploadForm')[0]);

		$.ajax({
			url: '/api/uploadPresentation',
			type: 'POST',
			xhr: function() {
				var presXhr = $.ajaxSettings.xhr();
				if (presXhr.upload) {
					presXhr.upload.addEventListener('progress', progressHandler, false);
					$(".upstart").val("Please wait...");
					$(".upstart").attr("disabled","disabled");
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


	// function uploadPresentation(file, status) {
	// 	// var formData = new FormData($('form#uploadForm')[0]);
	// 	$.ajax({
	// 		url: '/api/uploadPresentation',
	// 		type: 'POST',
	// 		xhr: function() {
	// 			var presXhr = $.ajaxSettings.xhr();
	// 			if (presXhr.upload) {
	// 				presXhr.upload.addEventListener('progress', progressHandler, false);
	// 				$(".upstart").html("Uploading " + filename + "...");
	// 				$(".upstart").attr("disabled","disabled");
	// 			}
	// 			return presXhr;
	// 		},
	// 		beforeSend: function() {
	// 			$('progress').show();
	// 		},
	// 		success: function(data, status,jqXHR) {
	// 			data = JSON.parse(data);
	// 			console.log("STATUS: " + data, status);
	// 			if (data.success == true) {
	// 				var presentationURL = "/presenter#" + data.data.id;
	// 				window.location.replace(presentationURL);
	// 			} else {
	// 				alert("Failed to upload.");
	// 			}
	// 		},
	// 		error: function(jqXHR, status, error) {
	// 			alert("ERROR", status, error);
	// 		},
	// 		data: file,
	// 		cache: false,
	// 		contentType: false,
	// 		processData: false
	// 	});
	// }

	function progressHandler(e) {
		if (e.lengthComputable) {
			$('progress').attr({value: e.loaded, max:e.total});
			if (e.loaded == e.total) {
				$(".upstart").html("Converting " + filename + "...");
			}
		}
	}
});