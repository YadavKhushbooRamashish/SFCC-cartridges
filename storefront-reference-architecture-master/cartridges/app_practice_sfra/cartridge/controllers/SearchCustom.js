'use strict';

var server = require('server');
var ProductMgr = require('dw/catalog/ProductMgr');
var URLUtils = require('dw/web/URLUtils');
server.get('Show',function(req, res, next){
  res.render('search/searchCustom');
  next();
});

server.get('GetProduct', function(req, res, next){
  var productID = req.querystring.pid;
  var product = ProductMgr.getProduct(productID);

  if(product && product.online){
    res.render('search/productResult', { Product: product});
  } else {
    res.render('search/productNotFound', { pid: productID});
  }
  next();
});

module.exports = server.exports();
