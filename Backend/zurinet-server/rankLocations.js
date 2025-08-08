import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const HF_API_KEY = process.env.HF_API_KEY; // your Hugging Face API token
const HF_MODEL = "facebook/bart-large-mnli"; // zero-shot model

async function classifyIncident(text) {
  const labels = ["murder", "rape", "assault", "attack"]; // crime types

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${HF_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          candidate_labels: labels,
          multi_label: true,
        },
      }),
    }
  );

  const result = await response.json();
  return result; // returns { labels: [...], scores: [...] }
}

export async function rankLocations(locations, articles) {
  let ranking = {};

  for (let location of locations) {
    let totalScore = 0;

    for (let article of articles) {
      const text = `${article.title} ${article.description} ${
        article.content || ""
      }`;

      // Step 1: Only check articles mentioning this location
      if (text.toLowerCase().includes(location.toLowerCase())) {
        // Step 2: Classify the article
        const classification = await classifyIncident(text);

        // Step 3: Weighted severity scoring
        classification.labels.forEach((label, i) => {
          const confidence = classification.scores[i];
          if (confidence > 0.5) {
            // only count if confidence is high enough
            if (label === "murder") totalScore += 5;
            if (label === "rape") totalScore += 4;
            if (label === "assault") totalScore += 3;
            if (label === "attack") totalScore += 2;
          }
        });
      }
    }

    ranking[location] = totalScore;
    console.log(ranking);
  }

  // Step 4: Return sorted ranking
  return Object.entries(ranking)
    .map(([location, score]) => ({ location, score }))
    .sort((a, b) => b.score - a.score);
}
