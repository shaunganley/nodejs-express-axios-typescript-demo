import { Request, Response, Application } from "express"
import { Product } from "../model/product";
const productService = require('../service/productService')

module.exports = function(app: Application){

    app.get('/products', async (req: Request, res: Response) => {
        let data: Product[]

        try {
            data = await productService.getProducts()
        } catch (e) {
            console.error(e);
        }

        res.render('list-products', { products: data } ) 
    })

    app.get('/products/:id', async (req: Request, res: Response) => {
        let data: Product

        try {
            data = await productService.getProductById(req.params.id)
        } catch (e) {
            console.error(e);
        }
        
        res.render('view-product', { product: data } ) 
    })

    app.get('/add-product-name', async (req: Request, res: Response) => {
        if (!req.session.product) {
            req.session.product = {}
        }

        res.render('add-product-name') 
    })

    app.post('/add-product-name', async (req: Request, res: Response) => { 
        req.session.product["name"] = req.body.name       

        res.redirect('/add-product-description')
    })

    app.get('/add-product-description', async (req: Request, res: Response) => {
        res.render('add-product-description') 
    })

    app.post('/add-product-description', async (req: Request, res: Response) => { 
        req.session.product["description"] = req.body.description       

        res.redirect('/add-product-price')
    })

    app.get('/add-product-price', async (req: Request, res: Response) => {
        res.render('add-product-price') 
    })

    app.post('/add-product-price', async (req: Request, res: Response) => { 
        req.session.product["price"] = req.body.price       

        res.redirect('/add-product-confirmation')
    })

    app.get('/add-product-confirmation', async (req: Request, res: Response) => {
        res.render('add-product-confirmation', req.session.product) 
    })

    app.post('/add-product-confirmation', async (req: Request, res: Response) => {        
        let data: Product = req.session.product
        let id: Number

        try {
            id = await productService.createProduct(data, req.session.token)

            req.session.product = undefined

            res.redirect('/products/' + id)
        } catch (e) {
            console.error(e);

            res.locals.errormessage = e.message

            res.render('add-product-confirmation', req.session.product)
        }
    })
}
