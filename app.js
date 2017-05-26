var restify = require('restify');
var builder = require('botbuilder');
require('dotenv').config();

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

var DialogLabels = {
    Sales: 'Sales',
    Success: 'Sucess',
    Support: 'Support'
};

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, [
    function(session) {
        // prompt for search option
        builder.Prompts.choice(
            session,
            'Hello! Welcome to Slacker, the hub for your intranet-data needs. Which team would you like data for?', [DialogLabels.Sales, DialogLabels.Success, DialogLabels.Support], {
                maxRetries: 3,
                retryPrompt: 'Sorry, not a valid option.'
            });
    },
    function(session, result) {
        if (!result.response) {
            // exhausted attemps and no selection, start over
            session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
            return session.endDialog();
        }

        // on error, start over
        session.on('error', function(err) {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

        // continue on proper dialog
        var selection = result.response.entity;
        switch (selection) {
            case DialogLabels.Sales:
                return session.beginDialog('');
            case DialogLabels.Success:
                return session.beginDialog('');
            case DialogLabels.Support:
                return session.beginDialog('')
        }
    }
]);
