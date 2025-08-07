import "./App.css";
import MapContent from "./googleMaps/loadMap";
import RedZoneChecker from "./googleMaps/redZoneChecker";

function App() {
  return (
    <div className="App">
      <div className="redzone-checker-container">
        <RedZoneChecker />
      </div>
      <div className="map-container">
        <MapContent />
      </div>
    </div>
  );
}

export default App;
