'use strict';

var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

function getService(PayPal) {
    var serviceObj = LocalServiceRegistry.createService(PayPal, {
        createRequest: function (svc, params) {
            svc.requestMethod = 'GET';
            svc.addHeader('Content-Type', 'application/json');

            var baseUrl = svc.getConfiguration().getCredential().getURL();

            svc.setURL(
                baseUrl +
                    '?latitude=' +
                    params.latitude +
                    '&longitude=' +
                    params.longitude +
                    '&current=temperature_2m,wind_speed_10m'
            );

            return svc;
        },
        parseResponse: function (svc, response) {
            var responseObject = {};

            if (response && response.statusCode === 200 && response.text) {
                responseObject = JSON.parse(response.text);
            }
            return responseObject;
        }
        
    });

    return serviceObj;
}
module.exports = {
    getService: getService
};
