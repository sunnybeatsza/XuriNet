import nlp from "compromise";

/**
 * Extract locations (places) from text using compromise
 * @param {string} text
 * @returns {string[]} list of unique location names
 */
export function extractLocations(text) {
  const doc = nlp(text);
  const places = doc.places().out("array"); // extract place names
  return [...new Set(places)]; // unique values
}

/**
 * Extract locations from an array of articles
 * @param {Array} articles - news articles with title, description, content
 * @returns {string[]} unique location names from all articles
 */
export function extractLocationsFromArticles(articles) {
  let allLocations = [];

  for (const article of articles) {
    const text = [article.title, article.description, article.content]
      .filter(Boolean)
      .join(" ");
    allLocations = allLocations.concat(extractLocations(text));
  }

  return [...new Set(allLocations)];
}
