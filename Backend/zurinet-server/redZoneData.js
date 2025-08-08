import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const NEWS_API_KEY = process.env.NEWS_API_KEY;

/**
 * Generic function to fetch news from NewsAPI
 * @param {string} query - search query (supports OR operators)
 * @param {object} options - additional API parameters
 * @returns {Promise<Array>} - array of articles
 */
export async function fetchNews(query, options = {}) {
  const baseUrl = "https://newsapi.org/v2/everything";

  // Default params
  const params = new URLSearchParams({
    q: query,
    language: options.language || "en",
    sortBy: options.sortBy || "publishedAt",
    pageSize: options.pageSize || 20,
    apiKey: NEWS_API_KEY,
  });

  // Allow overriding/adding params
  Object.keys(options).forEach((key) => {
    if (key !== "language" && key !== "sortBy" && key !== "pageSize") {
      params.append(key, options[key]);
    }
  });

  const url = `${baseUrl}?${params.toString()}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "ok") {
    throw new Error(`NewsAPI error: ${data.message}`);
  }

  return data.articles || [];
}
