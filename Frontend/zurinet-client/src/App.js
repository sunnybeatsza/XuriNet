import "./App.css";
import MapContent from "./googleMaps/loadMap";

function App() {
  return (
    <div className="App">
      <div className="map-container">
        <MapContent />
      </div>
    </div>
  );
}

export default App;
