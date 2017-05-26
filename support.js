var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');

module.exports = [
    function(session) {
        request('http://localhost:3978/support_stats', (err, res, body) => {
            session.send(body);
            session.reset();
        });
    }
];
