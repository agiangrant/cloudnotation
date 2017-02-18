// script.js
$(document).ready(function() {
	$("#settingsIcon").on('click', function(){
		if($("#settingsDropdown").is(":visible")) {
			$("#settingsDropdown").hide();
		}
		else {
			$("#settingsDropdown").show();
		}
		$(this).toggleClass("background-darker");
		console.log("hit");
	});
	$("#loadProfile").on('click', function() {
		$("#chat").hide();
		$("#editor").hide();
		$("#profile").hide();
		$("#profile").show();
		$.get("/profile", function(data) {
			var setProfile = function() {
				if(data.age)
					$("#profileAge").val(data.age);
				if(data.city)
					$("#profileCity").val(data.city);
				if(data.state)
					$("#profileState").val(data.state);
				if(data.country)
					$("#profileCountry").val(data.country);
			};
			setProfile();
			$("#loadProfile").on('click', function() {
				setProfile();
			});
		});
		$.get("/flag_icons", function(data) {
			if(data !== undefined) {
				$.each(data, function(idx, val) {

				});
			}
		});
	});
});