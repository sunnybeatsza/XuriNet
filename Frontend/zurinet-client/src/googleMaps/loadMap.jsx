import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

//Define libraries needed
const libraries = ["places"];

//Environment variables
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

//Main map component
const MapContent = () => {
  const { isLoaded, LoadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });
};
