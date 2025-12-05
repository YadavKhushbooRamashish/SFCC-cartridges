'use strict';

var server = require('server');

var WeatherService = require('*/cartridge/scripts/services/WeatherService');

server.get('Show', function (req, res, next) {
    res.render('Weather');
    next();
});

server.get('GetData', function (req, res, next) {
    try {
        var latitude = req.querystring.latitude;
        var longitude = req.querystring.longitude;

        var weatherSvc = WeatherService.getService('PayPal');

        var result = weatherSvc.call({
            latitude: latitude,
            longitude: longitude
        });
        if (result.ok) {
            res.json({
                success: true,
                data: result.object
            });
        } else {
            res.json({
                success: false,
                message: result.errorMessage
            });
        }
    } catch (e) {
        var test = e;
        var stop = 0;
    }

    next();
});

module.exports = server.exports();
