import React, { useState, useEffect } from "react";
// Expanded fallback red zones (no "CBD" labels)
const fallbackRedZones = [
  { lat: -26.2041, lng: 28.0473, radius: 2 }, // Johannesburg
  { lat: -26.1952, lng: 28.0341, radius: 1.5 }, // Hillbrow, Johannesburg
  { lat: -26.1458, lng: 28.0416, radius: 1.5 }, // Alexandra Township
  { lat: -26.2708, lng: 27.8586, radius: 1.2 }, // Soweto
  { lat: -26.1844, lng: 27.9731, radius: 1.4 }, // Diepsloot
  { lat: -26.3167, lng: 27.9833, radius: 1.3 }, // Eldorado Park
  { lat: -26.2833, lng: 28.2167, radius: 1.4 }, // Tembisa

  { lat: -25.7461, lng: 28.1881, radius: 1.8 }, // Pretoria
  { lat: -25.7215, lng: 28.3818, radius: 1.3 }, // Mamelodi
  { lat: -25.7449, lng: 28.182, radius: 1.2 }, // Sunnyside, Pretoria
  { lat: -25.7032, lng: 28.2596, radius: 1.2 }, // Atteridgeville

  { lat: -29.8587, lng: 31.0218, radius: 2 }, // Durban
  { lat: -29.85, lng: 30.9833, radius: 1.3 }, // Umlazi
  { lat: -29.795, lng: 30.85, radius: 1.4 }, // KwaMashu
  { lat: -29.8833, lng: 31.05, radius: 1.2 }, // Inanda

  { lat: -33.9249, lng: 18.4241, radius: 1.7 }, // Cape Town
  { lat: -34.05, lng: 18.6333, radius: 1.5 }, // Khayelitsha
  { lat: -34.0, lng: 18.6667, radius: 1.4 }, // Mfuleni
  { lat: -33.9833, lng: 18.65, radius: 1.4 }, // Nyanga
  { lat: -33.9667, lng: 18.6, radius: 1.3 }, // Gugulethu
  { lat: -34.0333, lng: 18.6833, radius: 1.3 }, // Delft
  { lat: -34.0, lng: 18.5833, radius: 1.2 }, // Philippi

  { lat: -29.1211, lng: 26.214, radius: 1.5 }, // Bloemfontein
  { lat: -29.05, lng: 26.2333, radius: 1.3 }, // Botshabelo
  { lat: -29.0333, lng: 26.2167, radius: 1.2 }, // Thaba Nchu

  { lat: -32.9917, lng: 27.8715, radius: 1.2 }, // East London
  { lat: -33.0153, lng: 27.9116, radius: 1.4 }, // Mdantsane
  { lat: -33.2833, lng: 27.8833, radius: 1.3 }, // Duncan Village

  { lat: -25.6848, lng: 27.2416, radius: 1.3 }, // Rustenburg
  { lat: -24.6544, lng: 25.9086, radius: 1.5 }, // Mafikeng
  { lat: -27.75, lng: 29.9333, radius: 1.3 }, // Newcastle
  { lat: -27.77, lng: 29.95, radius: 1.2 }, // Madadeni

  { lat: -30.75, lng: 30.45, radius: 1.3 }, // Port Shepstone
  { lat: -31.6167, lng: 28.7833, radius: 1.3 }, // Mthatha
  { lat: -31.6, lng: 28.7833, radius: 1.2 }, // Ngangelizwe

  { lat: -28.2333, lng: 28.3167, radius: 1.3 }, // Bethlehem
  { lat: -28.55, lng: 29.7833, radius: 1.2 }, // Ladysmith

  { lat: -33.6, lng: 26.8833, radius: 1.3 }, // Grahamstown (Makhanda)
  { lat: -33.92, lng: 25.57, radius: 1.3 }, // Gqeberha (Port Elizabeth)
  { lat: -33.85, lng: 25.6, radius: 1.2 }, // Motherwell
];

// Environment variables
const apiKey = process.env.REACT_APP_Maps_API_KEY;
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://zurinet.onrender.com";

const fetchRedZoneData = async () => {
  let zones =
    fallbackRedZones && fallbackRedZones.length ? [...fallbackRedZones] : [];

  try {
    const response = await fetch(`${API_BASE_URL}/redZoneData`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    if (data.redZones && Array.isArray(data.redZones)) {
      const apiZones = data.redZones.map((zone) => ({
        lat: zone.lat || zone.latitude,
        lng: zone.lng || zone.longitude,
        radius: zone.radius || zone.riskLevel || 1.5,
        name: zone.name || zone.location,
        riskScore: zone.riskScore || zone.score,
      }));

      // Combine fallback + API zones, optionally removing duplicates (based on lat,lng)
      // For simplicity, just concatenate:
      zones = zones.concat(apiZones);
    }

    return zones;
  } catch (error) {
    console.error("Error fetching red zone data:", error);
    return zones; // fallback or whatever was collected so far
  }
};

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
  const [redZones, setRedZones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load red zone data on component mount
  useEffect(() => {
    const loadRedZoneData = async () => {
      setIsLoading(true);
      setStatus("Loading red zone data...");

      const zones = await fetchRedZoneData();
      setRedZones(zones);
      setLastUpdated(new Date());
      setIsLoading(false);
      setStatus("Red zone data loaded successfully");

      // Clear status after 2 seconds
      setTimeout(() => setStatus(""), 2000);
    };

    loadRedZoneData();
  }, []);

  // Function to refresh red zone data
  const refreshRedZoneData = async () => {
    setIsLoading(true);
    setStatus("Refreshing red zone data...");

    const zones = await fetchRedZoneData();
    setRedZones(zones);
    setLastUpdated(new Date());
    setIsLoading(false);
    setStatus("Red zone data refreshed");

    setTimeout(() => setStatus(""), 2000);
  };

  const checkRedZone = async (event) => {
    event.preventDefault();

    if (isLoading) {
      setStatus("Please wait, red zone data is still loading...");
      return;
    }

    setStatus("Checking...");

    const coords = await geocodeLocation(location);
    if (!coords) {
      setStatus("Location not found");
      return;
    }

    setMapCoords(coords);

    // Find the closest red zone and check if within radius
    let closestZone = null;
    let minDistance = Infinity;
    let isInRedZone = false;

    redZones.forEach((zone) => {
      const distance = getDistance(coords.lat, coords.lng, zone.lat, zone.lng);

      if (distance < minDistance) {
        minDistance = distance;
        closestZone = zone;
      }

      if (distance <= zone.radius) {
        isInRedZone = true;
      }
    });

    if (isInRedZone) {
      const zoneName = closestZone?.name || "Unknown area";
      setStatus(
        `🚨 Red Zone! High Risk Area near ${zoneName} (${minDistance.toFixed(
          2
        )}km away)`
      );
    } else {
      const zoneName = closestZone?.name || "nearest red zone";
      setStatus(
        `✅ Not in a red zone. Closest risk area: ${zoneName} (${minDistance.toFixed(
          2
        )}km away)`
      );
    }
  };

  const checkMyLocation = (event) => {
    event.preventDefault();

    if (isLoading) {
      setStatus("Please wait, red zone data is still loading...");
      return;
    }

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

        // Find the closest red zone and check if within radius
        let closestZone = null;
        let minDistance = Infinity;
        let isInRedZone = false;

        redZones.forEach((zone) => {
          const distance = getDistance(
            coords.lat,
            coords.lng,
            zone.lat,
            zone.lng
          );

          if (distance < minDistance) {
            minDistance = distance;
            closestZone = zone;
          }

          if (distance <= zone.radius) {
            isInRedZone = true;
          }
        });

        if (isInRedZone) {
          const zoneName = closestZone?.name || "Unknown area";
          setStatus(`🚨 You are in a red zone! High Risk Area: ${zoneName}`);
        } else {
          const zoneName = closestZone?.name || "nearest red zone";
          setStatus(
            `✅ You are not in a red zone. Closest risk area: ${zoneName} (${minDistance.toFixed(
              2
            )}km away)`
          );
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setStatus("Unable to retrieve your location.");
      }
    );
  };

  return (
    <div>
      <h2>Red Zone Checker</h2>

      {/* Data status and refresh button */}
      <div style={{ marginBottom: "10px", fontSize: "0.9em", color: "#666" }}>
        {lastUpdated && (
          <p>Data last updated: {lastUpdated.toLocaleTimeString()}</p>
        )}
        <button
          type="button"
          onClick={refreshRedZoneData}
          disabled={isLoading}
          style={{ marginBottom: "10px" }}
        >
          {isLoading ? "Loading..." : "Refresh Data"}
        </button>
        <p>Red zones loaded: {redZones.length}</p>
      </div>

      <form onSubmit={checkRedZone}>
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Enter location"
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Check location"}
        </button>
        <button type="button" onClick={checkMyLocation} disabled={isLoading}>
          {isLoading ? "Loading..." : "Check my location"}
        </button>
      </form>

      <h2>{status}</h2>
    </div>
  );
};

export default RedZoneChecker;
