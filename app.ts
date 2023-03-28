import { Request, Response } from "express"
import { Product } from "./model/product"

const express = require('express')
const app = express()
const path = require('path')
const nunjucks = require('nunjucks')
const session = require('express-session')

const appViews = path.join(__dirname, '/views/')
  
const nunjucksConfig = {
  autoescape: true,
  noCache: true,
  express: app
}

nunjucks.configure(appViews, nunjucksConfig)

app.set('view engine', 'html')

app.use('/public', express.static(path.join(__dirname, '/public')))

// Serve govuk-frontend in from node_modules (so not to break pre-extensions prototype kits)
app.use('/node_modules/govuk-frontend', express.static(path.join(__dirname, '/node_modules/govuk-frontend')))


app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: 'NOT HARDCODED SECRET', cookie: { maxAge: 60000 }}));

declare module "express-session" {
  interface SessionData {
    product: Product;
    token: string
  }
}

app.listen(3000, () => {
  console.log('Server started on port 3000')
})

app.get('/', async (req: Request, res: Response) => {     
    res.render('pizza', { title: 'New Pizza Time!' }) 
})

require('./controller/authController')(app);

const authMiddleware = require('./middleware/auth')
app.use(authMiddleware);

require('./controller/productController')(app);
