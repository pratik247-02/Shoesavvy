import express from 'express';
import { requireSignin, adminMiddleware } from '../middlewares/authmiddleware.js';
import { createproductController, 
    deleteProductController, 
    filterProductsController, 
    getPhotoController, 
    getProductlistController, 
    getProductsController, 
    getproductbySlugController, 
    getProductsCountController, 
    updateproductController,
    searchProductsController,
    similarProductsController,
    cwiseController,
    braintreeTokenController,
    braintreePaymentController} from '../controllers/productcontroller.js';
import formidable from 'express-formidable';

const Router = express.Router();

//create product
Router.post('/createproduct', requireSignin, adminMiddleware,formidable(), createproductController);

//update product
Router.put('/updateproduct/:pid', requireSignin, adminMiddleware,formidable(), updateproductController);

//get products
 Router.get('/getproducts', getProductsController);

//get single product by slug
Router.get('/getproducts/:slug', getproductbySlugController);

//get photo
Router.get('/getphoto/:pid', getPhotoController);

//delete product
Router.delete('/deleteproduct/:pid', requireSignin, adminMiddleware, deleteProductController);

//filter products 
Router.post('/filterproducts', filterProductsController);

//product count 
Router.get('/productcount', getProductsCountController);

//product per page
Router.get('/productlist/:page', getProductlistController);

//search products by name
Router.get('/searchproducts/:keyword', searchProductsController);

//similar products
Router.get('/similarproducts/:pid/:cid', similarProductsController );

//category wise product
Router.get('/cwiseproduct/:slug', cwiseController)

//payment routes
//to get a token
Router.get('/braintree/token',  braintreeTokenController);

//payment
Router.post('/braintree/payment',requireSignin, braintreePaymentController);

export default Router;