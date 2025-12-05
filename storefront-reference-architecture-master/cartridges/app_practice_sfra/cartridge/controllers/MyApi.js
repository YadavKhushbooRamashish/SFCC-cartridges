var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
 
//Stelcore email service
function getService (serviceName){
    var callService = null;
    try {
        callService = LocalServiceRegistry.createService(serviceName,{
            createRequest : function (svc, params){
                svc.requestMethod = 'POST';
                svc.addHeader("Content-Type", "application/json");
                return params;
            },
            parseResponse : function(svc,response){
                return JSON.parse(response.text);
            },
            mockCall:function(svs, args){
                    return {
                        statusCode: 200,
                        statusMessage: "Success",
                        text: JSON.stringify({
                            msg : "Mail Send Successfully...",
                            Status: "Success"
                        })
                    }
                }
        });
    } catch (error) {
        var ex = error;
    }
    return callService;
}
 
module.exports = {
    getService:getService
}
 