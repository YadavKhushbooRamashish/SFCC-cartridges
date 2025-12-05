// var page = module.superModule;
'use strict';
var server = require('server');
// server.extend(page)
var ProductMgr = require('dw/catalog/ProductMgr');
var URLUtils = require('dw/web/URLUtils');
var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
server.get('Show', function (req, res, next) {
    res.render('Search');
    next();
});

server.get('GetBundleProduct', function(req,res,next){
  try{
    var productId = req.querystring.pid;
    var product = ProductMgr.getProduct(productId);
   

    if(!product){
      res.json({
        success: false,
        message: 'Product not found'
      });
      return next();
    }
    var bundledProductArr = [];
    var map = new HashMap();
    if(product.isBundle()){
      var bundledProducts = product.getBundledProducts();
      var iterator = bundledProducts.iterator();
      while(iterator.hasNext()){
          var child = iterator.next();
          bundledProductArr.push({
            id: child.getID(),
            name: child.getName(),
            price: child.getPriceModel().getPrice().value,
            image: child.getImage('small', 0).getURL().toString()
          });
        }
      
        map.put('bundledProduct', bundledProductArr);
        map.put('isBundle',true);
    } else{
      map.put('isBundle',false);
      map.put('product',{
      id: product.getID(),
    name: product.getName(),
  price: product.getPriceModel().getPrice().value,
image: product.getImage('small',0).getURL().toString()  });
    }
      var template = new Template('newTemplate');
      var content = template.render(map).text;

      res.json({
            success: true,
            html: content
        });
      }

  catch(e){
    res.json({
            success: false,
            message: e.message + 'test'
        });
  }
  next();
});

// server.get('GetProduct', function (req, res, next) {
//     try {
//         var productId = req.querystring.pid;
//         var product = ProductMgr.getProduct(productId);
//         var template = new Template('newTemplate');

        

//         if (!product) {
//             res.json({
//                 success: false,
//                 message: 'Product not found'
//             });
//             return next();
//         }
//         var image = product.getImage('small');
//         var imageURL = image
//             ? image.getURL().toString()
//             : URLUtils.staticURL('/images/noimage.png');

//         // var productData = {
//         //     imageUrl: imageURL,
//         //     id: product.ID,
//         //     name: product.name,
//         //     price: product.priceModel.price.value,
//         //     Khushboo: product.custom.Comment
//         // };
//         var productMap = new HashMap();
//         productMap.put('imageUrl', imageURL);
//         productMap.put('id', product.ID);
//         productMap.put('name', product.name);
//         productMap.put('price', product.priceModel.price.value);
//         productMap.put('Khushboo', product.custom.Comment);
//         var content = template.render(productMap).text;
        
//         res.json({
//             success: true,
//             product: content
//         });

       

        
//     } catch (e) {
//         res.json({
//             success: false,
//             message: e.message + 'test'
//         });
//     }
//     next();
// });
module.exports = server.exports();
