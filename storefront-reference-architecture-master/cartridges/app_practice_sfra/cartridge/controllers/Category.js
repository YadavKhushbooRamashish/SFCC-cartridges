'use strict';
var server = require('server');
var CatalogMgr = require('dw/catalog/CatalogMgr');


server.get('ShowRemote', function(req, res, next){
  var cid = req.querystring.cid;
  var category = CatalogMgr.getCategory(cid);

  var productList = [];

  if(category && category.hasOnlineProducts()){
    var products = category.getOnlineProducts();
    products.toArray().forEach(function(product){
      productList.push(product);
    });
  }

  res.render('categoryProducts',{
    products: productList,
    category: category
  });
   
  next();
});
module.exports = server.exports();




