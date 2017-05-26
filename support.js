var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');

module.exports = [
    function(session) {
        request('http://localhost:3978/support_stats', (err, res, body) => {
            var jsonObject = JSON.parse(body);
            var firstDate = jsonObject[0];
            var secondDate = jsonObject[1];
            console.log(jsonObject);
            console.log(firstDate);
            var firstDateObject = new Date(firstDate.date);
            console.log(firstDate.date);
            //Week: <!date^"+firstDate.date"^{date_short}"
            var msg = new builder.Message(session).sourceEvent({
                slack: {
                    text: `Zendesk stats from ${secondDate.date} to ${firstDate.date}
                    
                    First Response within 1 hour: ${firstDate.first_resp_1_hour.data}%
                    Last week: ${secondDate.first_resp_1_hour.data}%
                    Trend: ${firstDate.first_resp_1_hour.trend}
                    Difference: ${firstDate.first_resp_1_hour.difference}
                    
                    Average first reply time: ${firstDate.avg_first_reply_time.data} hours
                    Last week:  ${secondDate.avg_first_reply_time.data} hours
                    Trend: ${firstDate.avg_first_reply_time.trend}
                    Difference: ${firstDate.avg_first_reply_time.difference}
                    
                    New tickets: ${firstDate.new_tickets.data}
                    Last week:  ${secondDate.new_tickets.data}
                    Trend: ${firstDate.new_tickets.trend}
                    Difference: ${firstDate.new_tickets.difference}
                    
                    Solved tickets: ${firstDate.solved_tickets.data}
                    Last week:  ${secondDate.solved_tickets.data}
                    Trend: ${firstDate.solved_tickets.trend}
                    Difference: ${firstDate.solved_tickets.difference}
                    
                    Backlog: ${firstDate.backlog.data}
                    Last week:  ${secondDate.backlog.data}
                    Trend: ${firstDate.backlog.trend}
                    Difference: ${firstDate.backlog.difference} `      
                }
            });
            session.send(msg)
            session.endDialog();
        });
    }
];
