import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

// Define libraries needed
const libraries = ["places"];

// Environment variables
const apiKey = process.env.REACT_APP_Maps_API_KEY;

// Map component
const MapContent = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  // Define a default center for the map
  const johannesburg = {
    lat: -26.2041,
    lng: 28.0473,
  };

  // Handle loading and error states
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  // If everything is loaded, render the map
  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "500px" }}
      zoom={10}
      center={johannesburg}
    >
      <Marker position={johannesburg} />
    </GoogleMap>
  );
};

export default MapContent;
