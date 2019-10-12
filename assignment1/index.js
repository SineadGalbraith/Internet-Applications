const express = require('express');
const app = express();
const server = app.listen(3000);
app.use(express.static('public'));
const fetch = require("node-fetch");
const api = '83ed0a936b1c720ba5289204836966c2';

app.get("/getWeather/:location", (request, response) => {
    let location = request.params.location;
    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + location + '&APPID=' + api)
    .then((res) => res.json())
    .then((data) => {
        response.send(data);
    })
    .catch(err => console.log("Something went wrong"))
});
