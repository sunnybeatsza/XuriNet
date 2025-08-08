// newsAPI.js
const NEWS_API_KEY =
  process.env.NEWS_API_KEY || "e111b3bcaa4e49819ffc6105a44fa68c"; // Replace with your actual API key
const BASE_URL = "https://newsapi.org/v2";

/**
 * Fetch news from NewsAPI
 * @param {string} endpoint - The NewsAPI endpoint ('everything', 'top-headlines', etc.)
 * @param {object} params - Query parameters for the API request
 * @returns {Promise<Array>} - Array of articles
 */
async function fetchNews(endpoint, params = {}) {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();

    // Add API key
    queryParams.append("apiKey", NEWS_API_KEY);

    // Add all other parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        queryParams.append(key, value);
      }
    });

    const url = `${BASE_URL}/${endpoint}?${queryParams.toString()}`;

    console.log(
      "Making request to NewsAPI:",
      url.replace(NEWS_API_KEY, "[API_KEY_HIDDEN]")
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "NewsAPI-Client/1.0",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `NewsAPI Error: ${response.status} - ${
          errorData.message || response.statusText
        }`
      );
    }

    const data = await response.json();

    // Check if the response is successful
    if (data.status !== "ok") {
      throw new Error(`NewsAPI Error: ${data.code} - ${data.message}`);
    }

    console.log(`Successfully fetched ${data.articles?.length || 0} articles`);
    console.log(`Total results available: ${data.totalResults || 0}`);

    return data.articles || [];
  } catch (error) {
    console.error("Error fetching news:", error.message);
    throw error;
  }
}

export default fetchNews;
