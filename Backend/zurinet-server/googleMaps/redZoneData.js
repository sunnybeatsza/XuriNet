import fetch from "node-fetch";
import { spawn } from "child_process";
import dotenv from "dotenv";

const NEWS_API_KEY = process.env.NEWS_API_KEY;

export async function fetchGBVArticles() {
  const url = `https://newsapi.org/v2/everything?q=gender%20based%20violence%20OR%20crime%20in%20Africa&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`;

  console.log("HF key:", process.env.HF_API_KEY);
  console.log("NewsAPI key:", process.env.NEWS_API_KEY);

  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  return data.articles || [];
}

export async function extractLocationsWithSpaCy(articles) {
  return new Promise((resolve, reject) => {
    const pyProcess = spawn("python", ["googleMaps/extractLocations.py"]);

    let dataString = "";

    pyProcess.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    pyProcess.stderr.on("data", (err) => {
      console.error("Python error:", err.toString());
    });

    pyProcess.on("close", () => {
      try {
        resolve(JSON.parse(dataString));
      } catch (error) {
        reject(error);
      }
    });

    // Send articles to Python script
    pyProcess.stdin.write(JSON.stringify({ articles }));
    console.log(articles);
    pyProcess.stdin.end();
  });
}
