const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(data => {
    createFeatures(data.features);
  });
  
  let myMap = L.map("map", {
    center: [39.97, -75.16],
    zoom: 5
});

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);  

d3.json(url).then(function (data) {
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    function getColor(magnitude) {
            switch (true) {
            case magnitude > 5:
              return "#ea2c2c";
            case magnitude > 4:
              return "#ea822c";
            case magnitude > 3:
              return "#ee9c00";
            case magnitude > 2:
              return "#eecc00";
            case magnitude > 1:
              return "#d4ee00";
            default:
              return "#98ee00";
            }
          }    

    function mapRadius(mag) {
            if (mag === 0) {
                return 1;
            }
    
            return mag * 4;
        }   
        L.geoJson(data, {
            // Maken cricles
            pointToLayer: function(feature, latlng) {
              return L.circleMarker(latlng);
            },
            // cirecle style
            style: styleInfo,
            // popup for each marker
            onEachFeature: function(feature, layer) {
              layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
            }
          }).addTo(myMap);
        
          // an object legend
          var legend = L.control({
            position: "bottomright"
          });
        
          // details for the legend
          legend.onAdd = function() {
            var div = L.DomUtil.create("div", "info legend");
        
            var grades = [0, 1, 2, 3, 4, 5];
            var colors = [
              "#98ee00",
              "#d4ee00",
              "#eecc00",
              "#ee9c00",
              "#ea822c",
              "#ea2c2c"
            ];
        
            // Looping through
            for (var i = 0; i < grades.length; i++) {
              div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
            }
            return div;
          };
        
          // Finally, we our legend to the map.
          legend.addTo(myMap);
        });
        
        