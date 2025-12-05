

'use strict';

var Logger = require('dw/system/Logger');
var ProductListMgr = require('dw/customer/ProductListMgr');


function execute(parameters) {
    try {
        var daysLimit = parseInt(parameters.daysLimit, 10);

        Logger.info("Wishlist cleanup job running with daysLimit = {0}", daysLimit);



        var wishlists = ProductListMgr.getProductLists(ProductListMgr.TYPE_WISH_LIST);
        var now = new Date();

        
        wishlists.forEach(function (wishlist) {

            var items = wishlist.items.toArray();

            items.forEach(function (item) {
                var addedDate = new Date(item.creationDate);
                var diffMS = now - addedDate;
                var diffDays = diffMS / (1000 * 60 * 60 * 24);

                if (diffDays > daysLimit) {
                    wishlist.removeItem(item);

                    Logger.info(
                        "Removed product {0} from wishlist {1} (age {2} days)",
                        item.productID,
                        wishlist.ID,
                        Math.floor(diffDays)
                    );
                }
            });
        });

        Logger.info("Wishlist cleanup job finished.");

    } catch (e) {
        Logger.error("Error in wishlist cleanup job: {0}", e.message);
    }
}

module.exports = {
    execute: execute
};
