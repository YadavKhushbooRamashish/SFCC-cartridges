'use strict';
var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');

module.exports.render = function(context, modelIn){
  var model = modelIn || new HashMap();
  var content = context.content;

  model.headline = content.headline;
  model.subheadline = content.subheadline || '';

  if(content.bgImage){
    model.bgImage = {
        url: content.bgImage.file.url,
        focalPointX: (content.bgImage.focalPoint.x * 100) + '%',
        focalPointY: (content.bgImage.focalPoint.y * 100) + '%'

    };
   
  }

  model.ctaLabel =  content.ctaLabel;
  model.ctaUrl = content.ctaUrl;

  return new Template('experience/components/commerce_assets/birthdayBanner').render(model).text;


}

