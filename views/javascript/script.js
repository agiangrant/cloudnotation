// script.js

var countries = [];
var instruments = [];
var genres = ["Blues", "Classical", "Electronic", "Folk", "Jazz", "Newage", "Pop", "Reggae", "Rock", "Traditional"];
var profileData = {};

var setProfile = function() {
	$("#profileAge").text(new Date(profileData.age.replace('-','/')).toLocaleDateString());
	$("#profileCity").text(profileData.city);
	$("#profileState").text(profileData.state);
	$("#profileCountry").text(profileData.country+ " ");
	if(profileData.country !== undefined && profileData.country.length > 0)
		$("#profileCountryFlag").attr("src", "/images/flag_icons/24/"+profileData.country+".png");
	$("#profileInstrument").text(profileData.instrument+ " ");
	if(profileData.instrument !== undefined && profileData.instrument.length > 0)
		$("#profileInstrumentIcon").attr("src", "/images/musicons/24/"+profileData.instrument+".png");
	$("#profileGenre").text(profileData.genre);
	$("#profileArtist").text(profileData.artist);
	$("#profileAge").show();
	$("#profileCity").show();
	$("#profileState").show();
	$("#profileCountry").show();
	$("#profileInstrument").show();
	$("#profileGenre").show();
	$("#profileArtist").show();
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
		$("#settingsIcon").click();
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
			$("#profileAgeEdit").val(profileData.age.replace('/','-')).show();
			$("#profileCityEdit").val(profileData.city).show();
			$("#profileStateEdit").val(profileData.state).show();
			$("#profileCountryEdit").find('option').remove().end();
			$.each(countries, function(idx, val) {
				$("#profileCountryEdit").append("<option value=\""+val+"\">"+val+"</option>");
			});
			$("#profileCountryEdit").val(profileData.country).show();
			$("#profileInstrumentEdit").find('option').remove().end().show();
			$.each(instruments, function(idx, val) {
				$("#profileInstrumentEdit").append("<option value=\""+val+"\">"+val+"</option>");
			});
			$("#profileInstrumentEdit").val(profileData.instrument).show();
			$("#profileGenreEdit").find('option').remove().end();
			$.each(genres, function(idx, val) {
				$("#profileGenreEdit").append("<option value=\""+val+"\">"+val+"</option>");
			});
			$("#profileGenreEdit").val(profileData.genre).show();
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