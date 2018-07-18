exports.reportType = function(reportName) {

    switch (reportName) {

        case 'mediclaim':
            var proc = 'execute SP_GetUserDetailsforMedicalInsurance';
            return proc;
        default:
            return ('Sorry, we are out of ' + reportName + '.');
    }
}