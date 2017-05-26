const pool = require('./db.js');


module.exports = function(server) {

    var support_stats = [];

    server.get('/support_stats', (req, res, next) => {

        pool.query(`SELECT
                    date_trunc('week', ticket_created_at) as date,
                    count(*) as new_tickets,
                    count(CASE WHEN reply_time_minutes <= 60 THEN 1 ELSE NULL END) as replies_1_hour,
                    avg(reply_time_minutes) / 60 as avg_reply_time
                    FROM zendesk_tickets
                    WHERE has_metrics AND status != 'deleted'
                    GROUP BY date
                    ORDER BY date DESC
                    LIMIT 2;
`, function(err, results) {
            if (err) {
                return console.error('error running query', err);
            }

            results.rows.forEach(function(row, i) {
                support_stats.push({
                    date: row.date,
                    first_resp_1_hour: (row.replies_1_hour / row.new_tickets * 100).toFixed(2),
                    avg_first_reply_time: row.avg_reply_time,
                    new_tickets: row.new_tickets,
                });
            });
        });



        pool.query(`SELECT
                    date_trunc('week', solved_at) as date,
                    count(*) as solved_tickets
                    FROM zendesk_tickets
                    WHERE status IN ('closed', 'status')
                    AND solved_at IS NOT NULL
                    AND has_metrics
                    GROUP BY date
                    ORDER BY date DESC
                    LIMIT 2;
`, function(err, results) {
            if (err) {
                return console.error('error running query', err);
            }

            results.rows.forEach(function(row, i) {
                support_stats[i].solved_tickets = row.solved_tickets;
            });
        });

        pool.query(`SELECT dd.d AS date,
                    count(*) AS backlog
                    FROM generate_series(date_trunc('week',now() - interval '2 months'), date_trunc('week', now()), '1 week'::interval) dd(d)
                    INNER JOIN zendesk_tickets z ON (date_trunc('week',z.ticket_created_at) <= dd.d
                    AND (z.solved_at IS NULL OR date_trunc('week',z.solved_at) > dd.d))
                    WHERE (z.has_metrics)
                    AND (status NOT IN ('deleted', 'solved', 'closed'))
                    GROUP BY date
                    ORDER BY date DESC
                    LIMIT 2;
`, function(err, results) {
            if (err) {
                return console.error('error running query', err);
            }

            results.rows.forEach(function(row, i) {
                support_stats[i].backlog = row.backlog;
            });
        });

        res.send(support_stats);

    });
};
