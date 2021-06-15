const express = require('express');
const app = express();
app.listen(3000);
app.use(express.static('public'));
const fetch = require("node-fetch");
const api = '83ed0a936b1c720ba5289204836966c2';

// The code below shows the server side of my web app. 
// app.get("/getForecast/:location") will request the API call following in the fetch statement. The :location is 
// the location entered on the client side. The API call is then made using fetch, the location entered and the api
// key to retrieve the 5 day forecast for the location entered. The JSON object returned will then be sent to 
// localhost:3000/getForecast.
app.get("/getForecast/:location", (request, response) => {
    let location = request.params.location;
    fetch('http://api.openweathermap.org/data/2.5/forecast?q=' + location + '&APPID=' + api)
    .then((res) => res.json())
    .then((data) => {
        response.send(data);
    })
    .catch(err => console.log("Something went wrong: ", err))
});
