# Internet-Applications

Coding Labs and Assignments for the CSU44000 - Internet Applications Module @ TCD.

## Assignments

### Assignment 1
The objective of this assignment was to develop a simple application to allow the user to input a city and receive a 5 day weather forecast for that city using the OpenWeatherMap API.  

The user should also be able to see further details including:
- Advise on whether or not to pack an umbrella (depending on if rain is forecast over the following 5-day period).
- Advise on whether to pack for cold weather (temperature range: -10...+10), warm weather (temperature range: +10...+20) or hot weather (temperature range: 20+).
- A summary table showing the Temperature, Wind Speed and Rainfall Level for the next 5 days.

*To run program:* `npm start`  

#### End Result

(Styling was not required for this assignment).

- On Initial Startup:  
<p align="center">
  <img src="https://github.com/SineadGalbraith/Internet-Applications/blob/master/Assignment%201/images/InitialStartup.PNG" width="300" height="250">
</p>

- Query Results for 'Newry':
<p align="center">
  <img src="https://github.com/SineadGalbraith/Internet-Applications/blob/master/Assignment%201/images/CityQuery.PNG" width="700" height="350">
</p>

Languages/Frameworks Used: Javascript, HTML, Vue.js.


### Assignment 2
The objective of this assignment was to write a simple client (VueJS) that interacts with a server (NodeJS) which in turn interacts with a Cloud-Based Database (using AWS DynamoDB) and an Object stored in the Object-Store.  

A JSON file containing movie data was provided.

Using the client, the user should see the following buttons:
- Create Database - causes the server to make a table in a DynamoDB database which is then populated using the raw data from the object.
- Query Database (with input for movie name) - causes the server to find and display all the movies that begin with the text that the user has entered.
- Destroy Database - causes the database table to be deleted.

*To run program:* `npm start`  

#### End Result

(Styling was not required for this assignment).

- On Initial Startup:  
<p align="center">
  <img src="https://github.com/SineadGalbraith/Internet-Applications/blob/master/Assignment%202/images/InitialStartup.PNG" width="550" height="175">
</p>

- Query Results for movies containing the word 'The' in 2013:
<p align="center">
  <img src="https://github.com/SineadGalbraith/Internet-Applications/blob/master/Assignment%202/images/The2013Query.PNG" width="500" height="550">
</p>

Languages/Frameworks Used: Javascript, HTML, Vue.js.

## Labs

### Lab 1
The objective of this lab was to write a simple countdown program, in Javascript, using NodeJS and the Browser.

### Lab 3 & Assignment 3
(Lab 3 Folder)

The objective of this lab was to create a function that maintains a to-do-list, consisting of a list of simple things.
