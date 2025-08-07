import express from "express";
import {
  fetchGBVArticles,
  extractLocationsWithSpaCy,
} from "./googleMaps/redZoneData.js";

import { rankLocations } from "./googleMaps/rankLocations.js";

const app = express();

app.get("/redZoneData", async (req, res) => {
  try {
    const articles = await fetchGBVArticles();
    const locations = await extractLocationsWithSpaCy(articles);
    const ranked = rankLocations(locations, articles);

    res.json({ redZones: ranked });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing red zone data");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => console.log("Server running on port 3000"));
