import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

// Define libraries needed
const libraries = ["places"];

// Environment variables
const apiKey = process.env.REACT_APP_Maps_API_KEY;

// Map component
const MapContent = (lat = -26.2041, lng = 28.0473, zoom = 10) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  // Define a default center for the map
  const center = { lat, lng };

  // Handle loading and error states
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  // If everything is loaded, render the map
  return (
    <GoogleMap mapContainerClassName="google-map" zoom={10} center={center}>
      <Marker position={center} />
    </GoogleMap>
  );
};

export default MapContent;
