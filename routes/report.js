module.exports = function(express, db) {
    var route = express.Router();
    var reports = {};
    const sql = require('mssql');
    var reports = require('../services/reports'),
    detectReport = require('../helper/reports'),
    fs = require('fs');

    reports.getReports = function(req, res) {
        var proc = detectReport.reportType(req.params.report_name);
        new sql.Request()
            .query(proc)
            .then((result) => {
                reports.csv(result)
                    .then(filepath => {
                        var file = fs.createReadStream(filepath);
                        file.on('end', function() {
                            fs.unlink(filepath, function() {
                                console.log("File deleted");
                            });
                        });
                        file.pipe(res);
                    })
                    .catch(err => {
                        throw err;
                    })
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send('Something broke!');
            })
    }

    route.get('/export/:report_name/:type', reports.getReports);

    return route;
}