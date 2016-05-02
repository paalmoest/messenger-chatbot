var express = require('express');
var bodyParser = require('body-parser');
var path = require("path");
var facebook_chatbot = require('./facebook_chatbot');
var app = express();

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));
app.use('/facebook', facebook_chatbot);

app.listen(process.env.PORT || 3000);
