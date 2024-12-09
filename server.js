//  empty JS object to act as DB for all routes
WebsiteData = {};

// dotenv 
require('dotenv').config();


// Require Express to run server and routes
const express = require("express");


// initialize an instance
const app = express();

/* Dependencies */
const bodyParser = require("body-parser");


/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());



// Initialize the main project folder
app.use(express.static("website"));



// set the port number
const port = process.env.Port;

const server = app.listen(port, listening);

function listening() {
	console.log("server running");
	console.log(`running on localhost:${port}`);
}

// GET route
app.get("/all", getData);

function getData(req, res) {
    if (Object.keys(WebsiteData).length === 0) {
        res.status(404).send({ error: "No data available" });
    } else {
        res.send(WebsiteData);
    }
}


// POST route
app.post("/addWeatherData", getWeatherData);

function getWeatherData(req, res) {
    if (!req.body || !req.body.temperature || !req.body.date || !req.body.userResponse) {
        res.status(400).send({ error: "Incomplete data received" });
        return;
    }
    WebsiteData = req.body;
    res.send({ success: true, message: "Weather data added", data: WebsiteData });
}
