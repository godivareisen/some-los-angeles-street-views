var geocoder, mapLA, titleString, addressString, SLAAimage, address, panoramaArray, SLAAposition, SLAApov;

//var position

function initMap() {

	var myLatLng = {lat: 34.05, lng: -118.25};

	geocoder = new google.maps.Geocoder();

	mapLA = new google.maps.Map(document.getElementById("map"), {
		zoom: 9,
		center: myLatLng,
		scrollwheel: false,
		rotateControl: false,
		draggable: false,
		disableDefaultUI: true
	});

	function geocodeAddress(resultsMap, address) { //add position
		geocoder.geocode({"address": address}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				resultsMap.setCenter(myLatLng);
				var marker = new google.maps.Marker({
					map: resultsMap,
					position: results[0].geometry.location,
					title: address
				}); 

			} else {
				alert("Geocode was not successful for the following reason: " + status);
			}
		});
	}

	function makeSlides() {
		
		$("#imageSlides").bjqs({
			width: 400,
			height: 400,
			automatic: false,
			keyboardnav: true,
			showmarkers: false,
			usecaptions: true
		});

	}

	function makeStreetViews() {

		var panorama = new google.maps.StreetViewPanorama(document.getElementById("streetview"), {
					position: SLAAposition,
					pov: SLAApov,
					zoom: 1
					});

		var panoramaArray = [ ];

		$(panorama).each(function() {
			panoramaArray.push(panorama);
			// $("#streetview div.gm-style").wrap("<li> </li>");
			// return "<li>" + panorama + "</li>";
		});

		console.log(panoramaArray);
	}


	$.getJSON("/slaa", function(dataReceived) {

		for (i = 0; i < dataReceived.length; i++) {

			titleString = dataReceived[i].title;
			addressString = titleString + " Los Angeles, CA";

			SLAAimage = dataReceived[i].imageURL;
			$("#imageSlides ul").append("<li><img src = '" + SLAAimage + "' title = '" + titleString + "'/></li>");

			SLAAposition = dataReceived[i].position;
			SLAApov = dataReceived[i].pov;

			geocodeAddress(mapLA, addressString)

			makeStreetViews()

			// console.log(SLAAposition);
			// console.log(SLAApov);

		}

		makeSlides()

		console.log(dataReceived);

	});
}


$(document).ready(function() {
	$("#timeline").mouseenter( function() {
	    $("#about-content").show();
	});

	$("#timeline").mouseleave( function() {
	    $("#about-content").hide();
	});
});