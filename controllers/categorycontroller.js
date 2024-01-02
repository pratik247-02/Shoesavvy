import slugify from "slugify";
import categorymodel from "../models/categorymodel.js";

export const createCategoryController = async (req, res) => {
    try {
        const {name} = req.body;
        if(!name) return res.status(401).json({ success: false, message: "Name is required" })
        //Existing category
    const existingcat = await categorymodel.findOne({ name });
    if (existingcat) return res.status(401).json({ success: false, message: "Category already exists" })
    //Create category
    const category = await new categorymodel({ name, slug: slugify(name) }).save();
    res.status(201).json({ success: true, category, message: "Category created successfully" });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false,
            error,
        message: "Error in creating category"
         });
    }
} 

export const updateCategoryController = async (req, res) => {
    try {
        const {name} = req.body;
        const {id} = req.params;
        const category = await categorymodel.findByIdAndUpdate(
            id,
            {name, slug: slugify(name) },
            {new:true}
            )
       res.status(201).json({ success: true, 
        category, 
        message: "Category updated successfully" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false,
            error,
        message: "Error in updating category"
         });
    }
}

//to get all categories
export const getCategoriesController = async (req, res) => {
    try {
        const category = await categorymodel.find();
        res.status(200).json({success: true, 
            category,
        message: "Categories fetched successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, 
            error, 
            message: "Error in getting categories"});
    }
}

//to get single category
export const singlecategorycontroller = async (req, res) => {
    try {
        const category = await categorymodel.findOne({slug: req.params.slug});
        res.status(200).json({success: true,
            category,
        message: "Single Category fetched successfully"});
            
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, 
            error, 
            message: "Error in getting searched category"});
     }
}

//to delete category
export const deleteCategoryController = async (req, res) => {
    try {
        const {id} = req.params;
        const category = await categorymodel.findByIdAndDelete(id);
        res.status(200).json({success: true,
            category,
        message: "Category deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false,
            error,
        message: "Error in deleting category"});
    }
}