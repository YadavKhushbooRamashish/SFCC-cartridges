var Logger = require('dw/system/Logger');

function execute(parameters){
    var a = parameters.numA;
    var b = parameters.numB;

   

    var numA = parseInt(a, 10);
    var numB = parseInt(b, 10);

    var c = numA + numB;

    Logger.info("The sum of two numbers is: " + c);
}

module.exports = {
    execute: execute
};
