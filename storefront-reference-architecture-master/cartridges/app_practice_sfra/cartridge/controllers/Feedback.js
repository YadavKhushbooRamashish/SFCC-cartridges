'use strict';

var server = require('server');
var CatalogMgr = require('dw/catalog/CatalogMgr');


server.get('Show', function(req,res,next){
  res.render('categoryTabs');
  next();
});

server.get('GetProduct', function(req,res,next){
  try{
    var categoryId = req.querystring.categoryId;

    var catalog = CatalogMgr.getCatalog('storefront-catalog-m-non-en');
    if(!catalog){
      res.json({success: false, message: 'No catalog found'});
      return next();
    }

    var category = CatalogMgr.getCategory(categoryId);


    if(category){
      var products = category.getOnlineProducts();

      var productArray = [];
      var iterator = products.iterator();

      while(iterator.hasNext()){
        var p = iterator.next();
        productArray.push({
          id: p.ID,
          name: p.name,
          image: p.getImage('small',0) ? p.getImage('small',0).URL.toString():'',
          price: p.priceModel.price,
          khushboo: p.custom.orderbykhushboo

        });
      }
      

      res.json({success: true, products: productArray});
    } else {
      res.json({ success: false, message: 'Category not found'});
    }
  }catch (e){
      res.json({ success: false, message: e.message });
    }
    next();
});

server.post('GetAllProducts',function(req,res,next){
      var allProduct = JSON.parse(req.form.allProducts);
      var cartHelper = require('*/cartridge/scripts/cart/cartHelpers');
      var BasketMgr = require('dw/order/BasketMgr');
      var Transaction = require('dw/system/Transaction');

      var currentBasket = BasketMgr.getCurrentOrNewBasket();

      Transaction.wrap(function(){for (let i = 0; i < allProduct.length; i++) {
        var productId = allProduct[i].pid;
        var quantity = allProduct[i].quantity;
            cartHelper.addProductToCart(
                    currentBasket,
                    productId,
                    quantity,
                    null,
                    null
                );
        
      }
    });
    next();
      
})

module.exports = server.exports();






// 'use strict';

// var server = require('server');
// var CustomObjectMgr = require('dw/object/CustomObjectMgr');
// var Transaction = require('dw/system/Transaction');


// server.get('Submit', function (req, res, next) {
// res.render('test');
// next();  
// });
// server.post('FormSubmit', function(req, res, next){
//     var name = req.querystring.name;
//     var email = req.querystring.email;
//     var comment = req.querystring.comment;

//     try {
//         Transaction.wrap(function () {
//             var feedbackObj = CustomObjectMgr.createCustomObject('Feedback', email + new Date().getTime());
//             feedbackObj.custom.name = name;
//             feedbackObj.custom.customerEmail = email;
//             feedbackObj.custom.comment = comment;
//         });

//         res.json({ success: true });
//     } catch (e) {
//         res.json({ success: false, error: e.message });
//     }

//     next();
// });

// module.exports = server.exports();
// 'use strict';

// var server = require('server');
// var ProductMgr = require('dw/catalog/ProductMgr');
// var CustomObjectMgr = require('dw/object/CustomObjectMgr');
// var Transaction = require('dw/system/Transaction');



// server.get('Show',function(req, res, next){
//   res.render('search/searchCustom');
//   next();
// });

// server.get('GetProduct', function(req, res, next){
//   var productID = req.querystring.productId;
//   var product = ProductMgr.getProduct(productID.trim());

//   if(product && product.online){

//     var productData = {
//       id: product.ID,
//       name: product.name,
//       price: product.priceModel.price ? product.priceModel.price.value : 'N/A',
//       description: product.shortDescription ? product.shortDescription.source: 'No description available',
      
//     };
//     res.json({ Product: productData, success: true});
//   } else {
//     res.json({success: false, error: 'Product not found or offline'});
//   }
//   next();
// });

// module.exports = server.exports();
// server.get('Submit', function (req, res, next) {
//     res.render('test'); 
//     next();
// });


// 'use strict'


// server.post('FormSubmit', function (req, res, next) {
   
//     var name = req.form.name;
//     var email = req.form.email;
//     var comment = req.form.message; 
//     try {
//         Transaction.wrap(function () {
            
//             var feedbackObj = CustomObjectMgr.createCustomObject(
//                 'Feedback',
//                 email + new Date().getTime()
//             );

          
//             feedbackObj.custom.name = name;
//             feedbackObj.custom.customerEmail = email;
//             feedbackObj.custom.comment = comment;
             
//         });

        
//         res.json({
//             success: true,
//             message: 'Feedback saved successfully!'
//         });
//     } catch (e) {
       
//         res.json({
//             success: false,
//             error: e.message
//         });
//     }

//     next();
// });

// module.exports = server.exports();
