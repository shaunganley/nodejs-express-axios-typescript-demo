import { Product } from "../model/product";

module.exports.validateProduct = function (product: Product): string {
    if (product.name.length > 50) {
        return "Name greater than 50 characters";
    }

    if (product.description.length > 500) {
        return "Description greater than 500 characters";
    }

    if (product.price < 10) {
        return "Price less than £10";
    }

    return null
}