
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

//java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
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
  region: "eu-west-1",
  endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

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

var details = { 
    Bucket: "csu44000assignment2",
    Key: "moviedata.json"
}

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
                    // console.log(JSON.parse(data.Body));
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

var delParams = {
    TableName : "Movies"
};

app.get("/destroy", (request, response) => {
    dynamodb.deleteTable(delParams, function(err, data) {
        if (err) {
            console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
});


