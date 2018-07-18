module.exports = (express, db) => {
    var route = express.Router();
    var auth = {};
    var config = require('../services/configuration')();
    var bunyan = require('bunyan');
    var log = bunyan.createLogger({name: 'hrms'});

    auth.windowsauthentication = (req, res) => {
        var ldap = require('ldapjs');
        try {
            var adClient = ldap.createClient({ url: config.ldap.url });
            adClient.bind(req.body.username, req.body.password, function (err) {
                if (!err) {
                    res.send({
                        "status": "authenticated"
                    });
                } else {
                    res.send({
                        "status": "invalid",
                        "message": "invalid credentials"
                    })
                }
                adClient.unbind();
            });
        } catch (err) {
            var response = {};
            if (err.name && err.name == "InvalidCredentialsError") {
                response.status = "invalid";
                response.message = "invalid credentials";
            } else {
                response.status = "invalid";
                response.message = "unknown error";
            }
            res.status(404).send(response)
        }
    }


    route.post('/windows', auth.windowsauthentication);
    return route;

}
