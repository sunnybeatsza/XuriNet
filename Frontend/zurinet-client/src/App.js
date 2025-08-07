import React, { useState } from "react";
import "./App.css";
import MapContent from "./googleMaps/loadMap";
import RedZoneChecker from "./googleMaps/redZoneChecker";

function App() {
  const [mapCoords, setMapCoords] = useState({ lat: -26.2041, lng: 28.0473 });

  return (
    <div className="App">
      <div className="redzone-checker-container">
        <RedZoneChecker setMapCoords={setMapCoords} />
      </div>
      <div className="map-container">
        <MapContent lat={mapCoords.lat} lng={mapCoords.lng} />
      </div>
    </div>
  );
}

export default App;
