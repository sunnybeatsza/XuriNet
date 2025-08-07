const express = require("express");
const app = express();

// default home route
app.get("/", (request, response) => {
  response.send("Hello World!, Server is live");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
