module.exports = function () {
    if (process.env.ENVIRONMENT) {
        var config = require(`../config/config.${process.env.ENVIRONMENT}.js`)
        return config;
    }
    else {
        var config = require(`../config/config.dev.js`)
        return config;
    }
}