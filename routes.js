const pool = require('./db.js');

module.exports = function(server) {

    server.get('/support_stats', (req, res, next) => {
        var support_stats = [];

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
                    date: row.date.toISOString().slice(0, 10),
                    first_resp_1_hour: {
                        data: (row.replies_1_hour / row.new_tickets * 100).toFixed(2),
                        trend: null,
                        difference: null
                    },
                    avg_first_reply_time: {
                        data: row.avg_reply_time,
                        trend: null,
                        difference: null
                    },
                    new_tickets: {
                        data: row.new_tickets,
                        trend: null,
                        difference: null
                    },
                    solved_tickets: {
                        data: null,
                        trend: null,
                        difference: null
                    },
                    backlog: {
                        data: null,
                        trend: null,
                        difference: null
                    }
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
                    support_stats[i].solved_tickets.data = row.solved_tickets;
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
                        support_stats[i].backlog.data = row.backlog;
                    });

                    for (var key in support_stats[0]) {
                        if (support_stats[0][key].data > support_stats[1][key].data) {
                            support_stats[0][key].trend = 'increasing';
                        } else {
                            support_stats[0][key].trend = 'decreasing';
                        }
                        support_stats[0][key].difference = (((support_stats[0][key].data - support_stats[1][key].data) / support_stats[1][key].data) * 100).toFixed(2) + '%';

                        delete support_stats[1][key].difference;
                        delete support_stats[1][key].trend;
                    }
                    res.send(support_stats);
                });
            });
        });
    });
};
