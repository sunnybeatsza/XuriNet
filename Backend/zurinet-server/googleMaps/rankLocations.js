export function rankLocations(locations, articles) {
  let ranking = {};

  locations.forEach((location) => {
    const score = articles.reduce((total, article) => {
      const text = `${article.title} ${article.description} ${
        article.content || ""
      }`.toLowerCase();
      if (text.includes(location.toLowerCase())) {
        let severity = 0;
        if (text.includes("murder")) severity += 5;
        if (text.includes("rape")) severity += 4;
        if (text.includes("assault")) severity += 3;
        if (text.includes("attack")) severity += 2;
        return total + severity + 1;
      }
      return total;
    }, 0);

    ranking[location] = (ranking[location] || 0) + score;
  });

  return Object.entries(ranking)
    .map(([location, score]) => ({ location, score }))
    .sort((a, b) => b.score - a.score);
}
