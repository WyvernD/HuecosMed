const html_script = `
<!DOCTYPE html>
<html>
<head>
	<title>Quick Start - Leaflet</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="shortcut icon" type="image/x-icon" href="docs/images/favicon.ico">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="">
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>
 </head>
<body style="padding: 0; margin: 0">
<div id="mapid" style="width: 100%; height: 100vh;"></div>
<script>
	var mymap = L.map('mapid').setView([6.2447305,-75.5760133],15);
	
	var myIcon = L.icon({
        iconUrl: 'https://www.medellin.gov.co/siro/HuecosMed_web/img/iconos/004-pin.png',
        iconAnchor: [22, 42], // point of the icon which will correspond to marker's location 
    });
  
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(mymap);
	
	var marker = L.marker(mymap.getCenter(), {icon: myIcon}).addTo(mymap);
	var radius = L.circle(mymap.getCenter(), {
          color: "#58D2FF",
          fillColor: "#58D2FF",
          radius: 10.0
      }).addTo(mymap);

	var popup = L.popup();

	// function onMapClick(e) {
	//   L.marker(e.latlng).addTo(mymap);
	// 	popup
	// 		.setLatLng(e.latlng)
	// 		.setContent("You clicked the map at " + e.latlng.toString())
	// 		.openOn(mymap);
	// }

	// mymap.on('click', onMapClick);
	
	mymap.on('move', function () {
	  marker.setLatLng(mymap.getCenter());
	  radius.setLatLng(mymap.getCenter());
	});
	
  mymap.on('moveend', function () {
	  window.ReactNativeWebView.postMessage(JSON.stringify(mymap.getCenter()));
	});

</script>
</body>
</html>
`;

export default html_script;
