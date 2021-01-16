
/**
 * Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * This file is licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License. A copy of
 * the License is located at
 *
 * http://aws.amazon.com/apache2.0/
 *
 * This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
*/

const express = require('express');
const app = express();
app.listen(3000);
app.use(express.static('public'));
const fetch = require("node-fetch");
var AWS = require("aws-sdk");
var s3 = new AWS.S3();
var fs = require('fs');
var isActive = false;
var movies;

AWS.config.update({
  region: "eu-west-1"
});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

// This function populates the database. Once the table has been created and the data has been retrieved from the 
// bucket, a boolean variable is set to true and this function is called. The data returned from the bucket is stored
// in the global "movies" variable and it is iterated over and the respective data is pulled out and used to 
// populate the database.
function populate(){
    console.log("Populating database.")
    movies.forEach(function(movie){
        var movieParams = {
            TableName: "Movies",
            Item: {
                "year": movie.year,
                "title": movie.title,
                "info": movie.info
            }
        };

        docClient.put(movieParams, function(err, data) {
            if (err) {
                console.log("Unable to add movie ", movie.title, ". Error JSON:", JSON.stringify(err, null, 2));   
            }
        });
    });
    console.log("Data added.");
}

// The parameters for creating the table.
var params = {
    TableName : "Movies",
    KeySchema: [       
        { AttributeName: "year", KeyType: "HASH"},  //Partition key
        { AttributeName: "title", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "year", AttributeType: "N" },
        { AttributeName: "title", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

// The bucket details.
var details = { 
    Bucket: "csu44000assignment2",
    Key: "moviedata.json"
}

// When the create button is clicked on the client side, this URL will be fetched. Here the table is created and 
// the data is pulled from the bucket. Using a boolean variable which is initially set to false, once the data 
// from the bucket is returned, the variable is set to true, the relevant data is parsed and stored in global 
// variable movies and the populate function is called.
app.get("/create", (request, response) => {
    dynamodb.createTable(params, function(err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
            s3.getObject(details, function(err, data) {
                if (err) {
                    console.log('Error', err);
                } else {
                    isActive = true;
                    if(isActive) {
                        movies = JSON.parse(data.Body);
                        populate();
                    }
                }
            }); 
        }
    });
});

// When the query button is clicked on the client side, this function will be called. To search, you need to use the 
// title (or partial title (the query searches for any films that begin with the user input)) and year of the film 
// you would like to find. The parameters from the query are then set (using the user input from the client side) and
// the query is called. I then use an array to store the returned results. Once all of the results have been 
// returned and stored, they are then pushed to the client side.
app.get("/search/:title/:year", (request, response) => {
    let year = parseInt(request.params.year);
    var queryParams = {
        TableName : "Movies",
        KeyConditionExpression: "#yr = :yyyy and begins_with(title, :name)",
        ExpressionAttributeNames:{
            "#yr": "year"
        },
        ExpressionAttributeValues: {
            ":yyyy": year,
            ":name": request.params.title
        }
    }
    let items = [];
    docClient.query(queryParams, function(err, data) {
        if(err) {
            console.log("Unable to query. Error ", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded");
            data.Items.forEach(function(item) {
                items.push(item);
            });
            response.send(items);
        }
    });
})

// The parameter for deleting a table.
var delParams = {
    TableName : "Movies"
};

// The delete function used to delete the table.
app.get("/destroy", (request, response) => {
    dynamodb.deleteTable(delParams, function(err, data) {
        if (err) {
            console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
});


