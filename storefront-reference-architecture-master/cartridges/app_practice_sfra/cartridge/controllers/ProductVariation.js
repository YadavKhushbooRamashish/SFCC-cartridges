'use strict';
var server = require('server');
var ProductMgr = require('dw/catalog/ProductMgr');
var URLUtils = require('dw/web/URLUtils');
var HashMap = require('dw/util/HashMap');
var collections = require('*/cartridge/scripts/util/collections');

server.get('Show',function(req, res, next){
      res.render('Search');
      next();
});

server.get('GetProduct', function(req, res, next){
  var pid = req.querystring.pid;
  var product = ProductMgr.getProduct(pid);

  if(!product){
    res.json({ error: true, message: 'Product not found' });
    return next();
  }


  if(product.isMaster()) {
    var variationModel = product.variationModel;
    var attributes = variationModel.getProductVariationAttributes();
    var attrData = [];

    collections.forEach(attributes, function(attr){
      var values = variationModel.getAllValues(attr);
      var attrValues = [];
      collections.forEach(values, function(val){
       attrValues.push({ 
        id: val.ID, 
        name: val.displayValue 
      });
    });

      attrData.push({ 
        id: attr.ID, name: attr.displayName, values: attrValues

       });
    });

    var baseData = {
    isMaster: true,
    productId: product.ID,
    productName: product.name,
    image: product.getImage('large',0) ? product.getImage('large', 0).URL.toString() : '',
    price: product.priceModel.price ? product.priceModel.price.value : 0,
    variationAttributes: attrData
  };

  res.json(baseData);
}

else if(product.isVariant()){
  res.json({
    isMaster: false,
    isVariant: true,
    productId: product.ID,
    productName: product.name,
    image: product.getImage('large',0) ? product.getImage('large', 0).URL.toString() : '',
    price: product.priceModel.price ? product.priceModel.price.value : 0,

  });
}

else{
  res.json({
    isMaster: false,
    productId: product.ID,
    productName: product.name,
    image: product.getImage('large',0) ? product.getImage('large', 0).URL.toString() : '',
    price: product.priceModel.price ? product.priceModel.price.value : 0,
  });
}

next();

});


server.get('GetVariant', function(req, res, next) {
  var masterId = req.querystring.masterId;
  var filteredData = req.querystring.filterData || '{}';
  var filterData = JSON.parse(filteredData);

  var product = ProductMgr.getProduct(masterId);

  if(!product || !product.isMaster()){
      res.json({ error: true, message: 'Invalid master product' });
      return next();
}

var variationModel = product.variationModel;
var filterMap = new HashMap();

Object.keys(filterData).forEach(function (key) {
        filterMap.put(key, filterData[key]);
    });

var variants = variationModel.getVariants(filterMap);
var variant = variants && variants.length > 0 ? variants[0] : null;

if(variant) {
  res.json({
    variantId: variant.ID,
    name: variant.name,
    price: variant.priceModel.price.value? variant.priceModel.price.value : 0,
    image: variant.getImage('large', 0) ? variant.getImage('large', 0).URL.toString() : '',
  });
} else{
  res.json({ error: true, message: 'No matching variant found' });
}
 next();

});

module.exports = server.exports();
