import React, { useState } from "react";

const hardcodedRedZones = [
  { lat: -26.2041, lng: 28.0473, radius: 2 }, // Johannesburg CBD
  { lat: -26.1952, lng: 28.0341, radius: 1.5 }, // Hillbrow
];

//The idea is that a user will enter a location and the Geocoding API will find coordinates
const fakeGeocode = async (location) => {
  const locations = {
    johannesburg: { lat: -26.2041, lng: 28.0473 },
    hillbrow: { lat: -26.1952, lng: 28.0341 },
    sandton: { lat: -26.1076, lng: 28.0567 },
  };

  return locations[location.toLowerCase()] || null;
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

const RedZoneChecker = () => {
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  const checkRedZone = async (event) => {
    event.preventDefault();
    setStatus("Checking...");

    const coords = await fakeGeocode(location);
    if (!coords) {
      setStatus("Location not found");
      return;
    }

    const isInRedZone = hardcodedRedZones.some((zone) => {
      const distance = getDistance(coords.lat, coords.lng, zone.lat, zone.lng);
      return distance <= zone.radius;
    });
    setStatus(
      isInRedZone ? "🚨 Red Zone! High Risk Area." : "✅ Not a red zone."
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
      </form>
      <h2>{status}</h2>
    </div>
  );
};

export default RedZoneChecker;
