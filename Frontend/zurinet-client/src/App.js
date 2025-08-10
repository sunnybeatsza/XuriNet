import React, { useState, useRef } from "react";
import "./App.css";
import MapContent from "./googleMaps/loadMap";
import RedZoneChecker from "./googleMaps/redZoneChecker";

function App() {
  const [mapCoords, setMapCoords] = useState({ lat: -26.2041, lng: 28.0473 });
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState("");
  const watchIdRef = useRef(null);

  const sendLocation = async (latitude, longitude) => {
    try {
      await fetch("/api/send-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      });
      setStatus("Location sent");
    } catch (err) {
      setStatus("Failed to send location");
      console.error(err);
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setStatus("Tracking started...");
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCoords({ lat: latitude, lng: longitude });
        sendLocation(latitude, longitude);
      },
      (error) => {
        setStatus("Error getting location");
        console.error(error);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
    watchIdRef.current = watchId;
    setTracking(true);
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setTracking(false);
    setStatus("Tracking stopped");
  };

  return (
    <div className="App-container">
      <div className="App-header">Welcome to ZuriNet</div>

      <div className="App-content-container">
        <div className="redzone-checker-container">
          <RedZoneChecker setMapCoords={setMapCoords} />
          <button onClick={tracking ? stopTracking : startTracking}>
            {tracking ? "Stop Tracking" : "Track My Location"}
          </button>
          <p>Status: {status}</p>
        </div>

        <div className="map-container">
          <MapContent lat={mapCoords.lat} lng={mapCoords.lng} />
        </div>
      </div>
    </div>
  );
}

export default App;
