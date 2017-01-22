var express = require('express');
var router = express.Router();
var request = require('request');

function parseMessage(message) {
    return message + " right back!";
}

//  **************** Facebook Chatbot boilerplate ****************

var facebook_verify_token = process.env.CHATBOT_FACEBOOK_VERIFY_TOKEN;
var facebook_access_token = process.env.CHATBOT_FACEBOOK_ACCESS_TOKEN;

router.get('/webhook', function(req, res) {
    if (req.query['hub.verify_token'] === facebook_verify_token) {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
})

router.post('/webhook', function(req, res) {
    messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            var message = event.message.text;
            console.log("Message received: " + message.substring(0, 200));
            var responseMessage = parseMessage(message);
            sendTextMessage(sender, responseMessage);
        }
    }
    res.sendStatus(200);
});

function sendTextMessage(sender, text) {
    messageData = {
        text: text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

module.exports = router;
