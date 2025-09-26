//Import Express.js using the require keyword
//Initialise an express app by calling the express function
//Import the getNews function from the newsAPI.js
import { getNews } from "./newsAPI.js";
import express from "express"
const app = express();


//Define a default route for a GET request
app.get("/", (req, res) => {
    res.send("This is the default route!, Hello World!")
})

//Define a custom news route
app.get("/newsAPI", async (req, res) => {
    const newsData = await getNews("Pretoria");
    res.send(newsData)
})


//Define the Port Number for the Server to listen for request
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
