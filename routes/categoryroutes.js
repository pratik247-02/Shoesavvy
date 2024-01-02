import express  from "express";
import { createCategoryController, 
    deleteCategoryController, 
    getCategoriesController, 
    singlecategorycontroller, 
    updateCategoryController } 
    from "../controllers/categorycontroller.js";
import { adminMiddleware, requireSignin } from "../middlewares/authmiddleware.js";

const Router = express.Router();

//routes for category
Router.post('/createcategory', requireSignin, adminMiddleware, createCategoryController);

//update category
console.log("calling updatecategory")
Router.put('/updatecategory/:id', requireSignin, adminMiddleware, updateCategoryController);

//get all categories
Router.get('/getcategories', getCategoriesController);

//single category
Router.get('/singlecategory/:slug', singlecategorycontroller)

//delete category
Router.delete('/deletecategory/:id', requireSignin, adminMiddleware, deleteCategoryController)

export default Router ;