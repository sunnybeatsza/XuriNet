//Import Express.js using the require keyword
//Initialise an express app by calling the express function
//Import the getNews function from the newsAPI.js

const express = require("express");
const app = express();
import { getNews } from "./newsAPI";

//Define a default route for a GET request
app.get("/", (req, res) => {
    res.send("This is the default route!, Hello World!")
})