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
		$("#settingsIcon").click();
		var countries = [];
		var instruments = [];
		var genres = ["Blues", "Classical", "Electronic", "Folk", "Jazz", "Newage", "Pop", "Reggae", "Rock", "Traditional"];
		var profileData = {};
		$("#chat").hide();
		$("#editor").hide();
		$("#profile").hide();
		$("#profile").show();
		var setProfile = function() {
			console.log("hit");
			$("#profileAge").text(new Date(profileData.age).toLocaleDateString());
			$("#profileCity").text(profileData.city);
			$("#profileState").text(profileData.state);
			$("#profileCountry").text(profileData.country);
			$("#profileInstrument").text(profileData.instrument);
			$("#profileGenre").text(profileData.genre);
			$("#profileArtist").text(profileData.artist);
		};

		$.ajax({method: "GET", url:"/profile"}).done(function(data) {
			data = JSON.parse(data);
			if(data !== undefined) {
				profileData.age = data.age.replace('-','/');
				profileData.city = data.city;
				profileData.state = data.state;
				profileData.country = data.country;
				profileData.instrument = data.instrument;
				profileData.genre = data.genre;
				profileData.artist = data.artist;
			}
			setProfile();
		});
		$.get("/countries", function(data) {
			if(data !== undefined) {
				$.each(data, function(idx, val) {
					countries.push(val);
				});
			}
		});
		$.get("/instruments", function(data) {
			if(data !== undefined) {
				$.each(data, function(idx, val) {
					instruments.push(val);
				});
			}
		});
		$("#editProfile").on('click', function() {
			$("#profileAge").hide();
			$("#profileCity").hide();
			$("#profileState").hide();
			$("#profileCountry").hide();
			$("#profileInstrument").hide();
			$("#profileGenre").hide();
			$("#profileArtist").hide();
			$("#profileAgeEdit").val(profileData.age.replace('/','-')).show();
			$("#profileCityEdit").val(profileData.city).show();
			$("#profileStateEdit").val(profileData.state).show();
			$("#profileCountryEdit").show();
			$.each(countries, function(idx, val) {
				$("#profileCountryEdit").append("<option value=\""+val+"\">"+val+"</option>");
			});
			$("#profileInstrumentEdit").show();
			$.each(instruments, function(idx, val) {
				$("#profileInstrumentEdit").append("<option value=\""+val+"\">"+val+"</option>");
			});
			$.each(genres, function(idx, val) {
				$("#profileGenreEdit").append("<option value=\""+val+"\">"+val+"</option>");
			});
			$("#profileGenreEdit").val(profileData.genre);
			$("#profileGenreEdit").show();
			$("#profileArtistEdit").show().val(profileData.artist);
			$("#editProfile").hide();
			$("#saveEditProfile").show().on('click', function() {
				$.ajax({ method: "POST", url: "/profile", data: {
					age:$("#profileAgeEdit").val(),
					city: $("#profileCityEdit").val(),
					state: $("#profileStateEdit").val(),
					country: $("#profileCountryEdit :selected").val(),
					instrument: $("#profileInstrumentEdit :selected").val(),
					genre: $("#profileGenreEdit :selected").val(),
					artist: $("#profileArtistEdit").val()
				}}).done(function() {
				});
			});
		});
	});
});