'use strict';
var server = require('server');
var ProductMgr = require('dw/catalog/ProductMgr');
var CatalogMgr = require('dw/catalog/CatalogMgr');
var URLUtils = require('dw/web/URLUtils');
var HashMap = require('dw/util/HashMap');
var Template = require('dw/util/Template');
var BasketMgr = require('dw/order/BasketMgr');
var Transaction = require('dw/system/Transaction');
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');




server.get('Show', function (req, res, next) {
    res.render('categoryTab');
    next();
});

server.get('GetCategory', function (req, res, next) {
    var categoryId = req.querystring.id;
    var category = CatalogMgr.getCategory(categoryId);
    var productList = [];
    var map = new HashMap();
    var list = productListHelper.getCurrentOrNewList(req.currentCustomer.raw, { type: 10 });

    if (category) {
        var products = category.onlineProducts.iterator();

        while (products.hasNext()) {
            var product = products.next();

            
            var isInWishlist = list.items.toArray().some(function (item) {
                return item.productID === product.ID;
            });

            productList.push({
                pid: product.ID,
                name: product.name,
                price: product.priceModel.price.value,
                image: product.getImage('medium', 0).URL.toString(),
                wishlist: isInWishlist
            });
        }

        map.put('categoryName', category.displayName);
        map.put('products', productList);

        var template = new Template('productPage');
        var display = template.render(map).text;

        res.json({
            success: true,
            html: display
        });
    }

    next();
});


server.get('GetCompared', function(req, res, next){
    var products = req.querystring.pids;
    var productData = [];
    

    if(!products){
        res.json({
            success: false,
            message: 'NO product IDs provided for comparison'
        });
        return next();

    }

    var pids = products.split(',');
    pids.forEach(function(pid){
        var product = ProductMgr.getProduct(pid);
        if(product){
            var productDetails = {
                id: product.ID,
                name: product.name,
                image: product.getImage('medium', 0).getURL().toString(),
                price: product.priceModel.price.value,
                brand: product.brand ? product.brand : 'N/A'
                
            };

            productData.push(productDetails);
        }
    });
    productData.sort(function (a, b) {
        return a.price - b.price; 
    });
        var map = new HashMap();
        map.put('products',productData);

        var template = new Template('productComparisonTable');
        var content = template.render(map).text;

        res.json({
            success: true,
            html: content

        });

    
    
        next();
    

    

});

server.post('AddProduct', function(req, res, next){
    var pid = req.form.pid;
    var qty = parseInt(req.form.qty) || 1;

    var basket = BasketMgr.getCurrentOrNewBasket();
    var product = ProductMgr.getProduct(pid);

    if(!product){
        res.json({
            error: true,
            msg: 'Product not found'
        });
        return next();
    }try{
        Transaction.wrap(function(){
            var pli = basket.createProductLineItem(product, basket.defaultShipment);
            pli.setQuantityValue(qty);
        });

        res.json({
            success: true,
            totalQty: basket.productQuantityTotal
        });

    }
    catch(e){
        res.json({
            error: true,
            msg: 'Error adding product to cart'
        });
    }
    return next();
});



module.exports = server.exports();
