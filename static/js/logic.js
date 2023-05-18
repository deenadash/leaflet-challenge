let web = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(web).then(function (data) {
    // After getting response, push the data.features object to the createFeatures function.
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
    // function handling for popups to each marker
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p>
      <p>Magnitude: ${feature.properties.mag}, Depth: ${feature.geometry.coordinates[2]}</p>
      <p>Longitude: ${feature.geometry.coordinates[0]}, Latitude: ${feature.geometry.coordinates[1]}</p>`);
    }
    // function for circle markers on map
    function pointToLayer(feature, latlng) {
        let magni = parseFloat(feature.properties.mag);
        let colorDepth = chooseColor(feature.geometry.coordinates[2]);
        let geojsonMarkerOptions = geojsonMarker(magni,colorDepth);
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
    // function for selecting color by depth 
    function chooseColor(rating) {
        if ( rating < 10) {
          return '#DAF7A6';
        } else if ( rating < 30 ) {
          return '#FFC300';
        } else if ( rating < 50 ) {
            return '#FF5733';
        } else if ( rating < 70 ) {
            return '#C70039';   
        } else if ( rating < 90 ) {
            return '#900C3F';       
        } else {
          return '#581845';
        }
    }
    
    // functioning properties of markers
    function geojsonMarker(magni,colorDepth) {
        geojsonMarkerOptions = {
        radius: magni * 3,
        fillColor: colorDepth,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
        };
        return geojsonMarkerOptions
    };

    // creating legend on map
    var legend = L.control({ position: 'bottomright' });
    //  HTML elements for the legend
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend');
      var grades = [-10,10,30,50,70,90];
      // loop through the labels and add a div with a colored square for each
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + chooseColor(grades[i]+1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
    };

    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: pointToLayer
    
    });
  
    // Sending earthquakes layer and legend to the createMap function/
    createMap(earthquakes,legend);
  }
  


  function createMap(earthquakes,legend) {

    // the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [0, 0],
      zoom: 3,
      layers: [street, earthquakes]
    });
  
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    
    // Add the legend control to the map
    legend.addTo(myMap);
  
  }