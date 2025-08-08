import express from "express";
import fetchNews from "./newsAPI.js"; // your NewsAPI fetch
// import { extractLocationsWithSpaCy } from "./redZoneData.js"; // Python spaCy (if still used)
import { extractLocationsFromArticles } from "./extractLocations.js"; // JS extraction
import { rankLocations } from "./rankLocations.js";

const app = express();

app.get("/redZoneData", async (req, res) => {
  try {
    console.log("Fetching GBV articles from South Africa...");

    const articles = await fetchNews("everything", {
      q: "gender based violence OR GBV OR domestic violence OR sexual violence AND (South Africa OR SA)",
      from: "2025-07-08",
      to: "2025-08-08",
      language: "en",
      sortBy: "relevancy",
      page: 1,
      pageSize: 50, // Get more articles per request (max 100)
    });

    console.log(`Fetched ${articles.length} articles.`);

    // Filter out articles that might not be relevant or have missing content
    const validArticles = articles.filter(
      (article) =>
        article.title &&
        article.description &&
        article.content &&
        article.content !== "[Removed]" // NewsAPI sometimes returns [Removed] for content
    );

    console.log(`${validArticles.length} articles have valid content.`);

    console.log("Extracting locations from articles...");
    // If you still want to use Python spaCy:
    // const locations = await extractLocationsWithSpaCy(validArticles);

    // Using JS compromise extraction:
    const locations = extractLocationsFromArticles(validArticles);

    console.log(`Extracted ${locations.length} unique locations.`);

    console.log("Ranking locations...");
    const ranked = rankLocations(locations, validArticles);
    console.log("Ranking complete.");

    res.json({
      redZones: ranked,
      metadata: {
        totalArticles: articles.length,
        validArticles: validArticles.length,
        locationsFound: locations.length,
        fetchedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error processing red zone data:", error);
    res.status(500).json({
      error: "Error processing red zone data",
      message: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => console.log("Server running on port 3000"));
