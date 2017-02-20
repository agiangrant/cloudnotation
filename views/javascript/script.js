// script.js

var countries = [];
var instruments = [];
var genres = ["Blues", "Classical", "Electronic", "Folk", "Jazz", "Newage", "Pop", "Reggae", "Rock", "Traditional"];
var profileData = {};

var setProfile = function() {
	if(profileData.age !== undefined && profileData.age.length > 0)
		$("#profileAge").text(new Date(profileData.age.replace('-','/')).toLocaleDateString()).show();
	$("#profileCity").text(profileData.city).show();
	$("#profileState").text(profileData.state).show();
	$("#profileCountry").text(profileData.country || ""+ " ").show();
	if(profileData.country !== undefined && profileData.country.length > 0)
		$("#profileCountryFlag").attr("src", "/images/flag_icons/24/"+profileData.country+".png").show();
	$("#profileInstrument").text(profileData.instrument || ""+ " ").show();
	if(profileData.instrument !== undefined && profileData.instrument.length > 0)
		$("#profileInstrumentIcon").attr("src", "/images/musicons/24/"+profileData.instrument+".png").show();
	$("#profileGenre").text(profileData.genre || "").show();
	$("#profileArtist").text(profileData.artist).show();
	$("#profileAgeEdit").hide();
	$("#profileCityEdit").hide();
	$("#profileStateEdit").hide();
	$("#profileCountryEdit").hide();
	$("#profileInstrumentEdit").hide();
	$("#profileGenreEdit").hide();
	$("#profileArtistEdit").hide();
	$("#editProfile").show();
	$("#saveEditProfile").hide();
};

$(document).ready(function() {
	$(document).on('click', function(evt) {
		if(evt.target.id == "settingsIcon") {
			return;
		}
		if($("#settingsDropdown").is(":visible")) {
			$("#settingsIcon").click();
		}
	});
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
	$.ajax({method: "GET", url:"/profile"}).done(function(data) {
		data = JSON.parse(data);
		if(data !== undefined) {
			profileData.age = data.age;
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
			$.each(data.countries, function(idx, val) {
				countries.push(val);
			});
		}
	});
	$.get("/instruments", function(data) {
		if(data !== undefined) {
			$.each(data.instruments, function(idx, val) {
				instruments.push(val);
			});
		}
	});
	$("#loadProfile").on('click', function() {
		$("#chat").hide();
		$("#editor").hide();
		$("#profile").hide();
		$("#profile").show();
		setProfile();
		
		$("#editProfile").on('click', function() {
			$("#profileAge").hide();
			$("#profileCity").hide();
			$("#profileState").hide();
			$("#profileCountry").hide();
			$("#profileInstrument").hide();
			$("#profileGenre").hide();
			$("#profileArtist").hide();
			$("#profileCountryFlag").hide();
			$("#profileInstrumentIcon").hide();
			if(profileData.age !== undefined && profileData.age.length > 0)
				$("#profileAgeEdit").val(profileData.age.replace('/','-'));
			$("#profileAgeEdit").show();
			$("#profileCityEdit").val(profileData.city).show();
			$("#profileStateEdit").val(profileData.state).show();
			$("#profileCountryEdit").find('option').remove().end();
			$.each(countries, function(idx, val) {
				$("#profileCountryEdit").append("<option value=\""+val+"\">"+val+"</option>");
			});
			if(profileData.country !== undefined && profileData.country.length > 0)
				$("#profileCountryEdit").val(profileData.country);
			$("#profileCountryEdit").show();
			$("#profileInstrumentEdit").find('option').remove().end().show();
			$.each(instruments, function(idx, val) {
				$("#profileInstrumentEdit").append("<option value=\""+val+"\">"+val+"</option>");
			});
			if(profileData.instrument !== undefined && profileData.instrument.length > 0)
				$("#profileInstrumentEdit").val(profileData.instrument);
			$("#profileInstrumentEdit").show();
			$("#profileGenreEdit").find('option').remove().end();
			$.each(genres, function(idx, val) {
				$("#profileGenreEdit").append("<option value=\""+val+"\">"+val+"</option>");
			});
			if(profileData.genre !== undefined && profileData.genre.length > 0)
				$("#profileGenreEdit").val(profileData.genre);
			$("#profileGenreEdit").show();
			$("#profileArtistEdit").show().val(profileData.artist);
			$("#editProfile").hide();
			$("#saveEditProfile").show().on('click', function() {
				var postData = {
					age:$("#profileAgeEdit").val(),
					city: $("#profileCityEdit").val(),
					state: $("#profileStateEdit").val(),
					country: $("#profileCountryEdit :selected").val(),
					instrument: $("#profileInstrumentEdit :selected").val(),
					genre: $("#profileGenreEdit :selected").val(),
					artist: $("#profileArtistEdit").val()
				};
				profileData = postData;
				$.ajax({ method: "POST", url: "/profile", data: postData}).done(function() {
					setProfile();
				});
			});
		});
	});
});