'use strict';
var Logger = require('dw/system/Logger');
var OrderMgr = require('dw/order/OrderMgr');
var Transaction = require('dw/system/Transaction');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');

function execute() {
    try {
        Logger.info('OrderSummary Job Started');

        var now = new Date();
        var yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        Logger.info('Fetching orders created after: ' + yesterday.toString());

        var ordersIterator = OrderMgr.searchOrders(
            'creationDate >= {0}',
            'creationDate desc',
            yesterday
        );

        var totalOrderAmount = 0;
        var totalShippingAmount = 0;

        while (ordersIterator.hasNext()) {
            var order = ordersIterator.next();

            var orderTotal = order.totalGrossPrice
                ? order.totalGrossPrice.value
                : 0;

            var shippingAmount =
                order.defaultShipment &&
                order.defaultShipment.shippingTotalGrossPrice
                    ? order.defaultShipment.shippingTotalGrossPrice.value
                    : 0;

            totalOrderAmount += orderTotal;
            totalShippingAmount += shippingAmount;
        }
        Transaction.wrap(function () {
            var summaryId = 'summary_' + Date.now();

            var co = CustomObjectMgr.createCustomObject(
                'OrderSummary',
                summaryId
            );
            co.custom.totalOrderAmount = totalOrderAmount;
            co.custom.totalShippingAmount = totalShippingAmount;
            co.custom.generatedOn = now;
        });
        Logger.info(
            'Stored Summary => OrderTotal: {0}, ShippingTotal: {1}',
            totalOrderAmount,
            totalShippingAmount
        );

        Logger.info('OrderSummary Job completed successfully');
    } catch (e) {
        Logger.error('OrderSummary Job failed: ' + e.message);
    }
}
module.exports = { execute: execute };
