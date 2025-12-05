'use strict';

function ProductModel(product) {
    if (!product) return null;

    this.id = product.ID;
    this.name = product.name;
    this.description = product.shortDescription ? product.shortDescription.source : 'No description available';
}

module.exports = ProductModel;
