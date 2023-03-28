import { Product } from "../model/product";
const productValidator = require('../validator/productValidator')
const axios = require('axios');

module.exports.getProducts = async function (): Promise<Product[]> {
    try {
        const response = await axios.get('http://localhost:8080/api/products')

        return response.data
    } catch (e) {
        throw new Error('Could not get products')
    }
}

module.exports.getProductById = async function (id: number): Promise<Product> {
    try {
        const response = await axios.get('http://localhost:8080/api/products/' + id)

        return response.data
    } catch (e) {
        throw new Error('Could not get product')
    }
}

module.exports.createProduct = async function (product: Product, token: string): Promise<number> {
    const error: string = productValidator.validateProduct(product)

    if (error) {
        throw new Error(error)
    }

    try {
        const response = await axios.post('http://localhost:8080/api/products/', product, { params: { token: token } })

        return response.data
    } catch (e) {
        throw new Error('Could not create product')
    }
}