import React, { useState } from "react";

const hardcodedRedZones = [
  { lat: -26.2041, lng: 28.0473, radius: 2 }, // Johannesburg CBD
  { lat: -26.1952, lng: 28.0341, radius: 1.5 }, // Hillbrow, Johannesburg
  { lat: -25.7461, lng: 28.1881, radius: 1.8 }, // Pretoria CBD
  { lat: -29.8587, lng: 31.0218, radius: 2 }, // Durban Central
  { lat: -33.9249, lng: 18.4241, radius: 1.7 }, // Cape Town CBD
  { lat: -26.2708, lng: 27.8586, radius: 1.2 }, // Soweto
  { lat: -26.1458, lng: 28.0416, radius: 1.5 }, // Alexandra Township
  { lat: -29.1211, lng: 26.214, radius: 1.5 }, // Bloemfontein CBD
  { lat: -32.9917, lng: 27.8715, radius: 1.2 }, // East London CBD
  { lat: -33.0153, lng: 27.9116, radius: 1.4 }, // Mdantsane (near East London)
  { lat: -25.6848, lng: 27.2416, radius: 1.3 }, // Rustenburg Central
  { lat: -24.6544, lng: 25.9086, radius: 1.5 }, // Mafikeng CBD
];

// Environment variables
const apiKey = process.env.REACT_APP_Maps_API_KEY;

//The idea is that a user will enter a location and the Geocoding API will find coordinates
const geocodeLocation = async (location) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      location
    )}&key=${apiKey}`
  );

  const data = await response.json();
  if (
    data.status === "OK" &&
    data.results &&
    data.results[0] &&
    data.results[0].geometry
  ) {
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  }
  return null;
};

// You want to check if the user’s coordinates fall within a “radius” (e.g., 500 meters) of any red zone. That’s where the distance check comes in.

// Calculate distance (Haversine formula)
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const RedZoneChecker = ({ setMapCoords }) => {
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  const checkRedZone = async (event) => {
    event.preventDefault();
    setStatus("Checking...");

    const coords = await geocodeLocation(location);
    if (!coords) {
      setStatus("Location not found");
      return;
    }

    setMapCoords(coords);

    const isInRedZone = hardcodedRedZones.some((zone) => {
      const distance = getDistance(coords.lat, coords.lng, zone.lat, zone.lng);
      return distance <= zone.radius;
    });
    setStatus(
      isInRedZone ? "🚨 Red Zone! High Risk Area." : "✅ Not a red zone."
    );
  };

  const checkMyLocation = (event) => {
    event.preventDefault();
    setStatus("Getting your location...");
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMapCoords(coords);
        const isInRedZone = hardcodedRedZones.some((zone) => {
          const distance = getDistance(
            coords.lat,
            coords.lng,
            zone.lat,
            zone.lng
          );
          return distance <= zone.radius;
        });
        setStatus(
          isInRedZone
            ? "🚨 You are in a red zone! High Risk Area."
            : "✅ You are not in a red zone."
        );
      },
      (error) => {
        setStatus("Unable to retrieve your location.");
      }
    );
  };

  return (
    <div>
      <h2>Red Zone Checker</h2>
      <form onSubmit={checkRedZone}>
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Enter location"
          required
        />
        <button type="submit">Check location</button>
        <button type="submit" onClick={checkMyLocation}>
          Check my location
        </button>
      </form>
      <h2>{status}</h2>
    </div>
  );
};

export default RedZoneChecker;
