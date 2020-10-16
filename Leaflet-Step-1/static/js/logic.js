// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
center: [
37.09, -95.71
],
zoom: 5,
});


// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
};

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps).addTo(myMap);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  var earthquakeData = data.features;
  console.log(earthquakeData);


    for (var i = 0; i < earthquakeData.length; i++) {
        var magnitude = earthquakeData[i].properties.mag;

        var color = "";
        if (magnitude > 4.5) {
            color = "#dc143c";
        }
        else if (magnitude > 4.0) {
            color = "#ec5038";
        }
        else if (magnitude > 3.5) {
            color = "#f47136";
        }
        else if (magnitude > 3.0) {
            color = "#fc8c34";
        }
        else if (magnitude > 2.5) {
            color = "#fab009";
        }
        else {
            color = "#ffcc00";
        }

        var lat = earthquakeData[i].geometry.coordinates[1];
        var lon = earthquakeData[i].geometry.coordinates[0];

        var location = (`${lat}, ${lon}`);
        console.log(location);
        var url = earthquakeData[i].properties.url;
        var urlLink = (`<a target='_blank' href="${url}"> Click for more Info</a>`)
        console.log(urlLink);

        L.circle([earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: "white", 
            stroke: true,
            weight: 1,
            fillColor: color,

            radius: magnitude * 20000
        }).bindPopup("<h1>Magnitude: " + magnitude + "</h1><hr><h3>Location: " + earthquakeData[i].properties.place + "<br>" + urlLink).addTo(myMap);
    };
});
// Create a legend

var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<strong><h4>Magnitude</h4></strong>";
  div.innerHTML += '<i style="background: #dc143c"></i><span> > 4.5 </span><br>';
  div.innerHTML += '<i style="background: #ec5038"></i><span> 3.9 - 4.5 </span><br>';
  div.innerHTML += '<i style="background: #f47136"></i><span>  3.6 - 4.0  </span><br>';
  div.innerHTML += '<i style="background: #fc8c34"></i><span>  2.9 - 3.5 </span><br>';
  div.innerHTML += '<i style="background: #fab009"></i><span> 2.4 - 3.0 </span><br>';
  div.innerHTML += '<i style="background: #FFEDA0"></i><span> 0 - 2.5 </span><br>';
  
  return div;
};

legend.addTo(myMap);
