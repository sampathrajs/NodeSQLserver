module.exports = {
    csv: function (result) {
        let json2csv = require('json2csv').parse,
            fs = require('fs'),
            config = require('./configuration')();
        return new Promise((resolve, reject) => {
            let mediClaimReport = json2csv(result.recordset, Object.keys(result.recordset[0]));
            let filepath = config.reportpath.csv+Date.now()+'.csv';
            fs.writeFile(filepath, mediClaimReport, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(filepath); // This is what you need
                }
            });
        });
    }
}