import slugify from "slugify";
import productmodel from "../models/productmodel.js";
import categorymodel from "../models/categorymodel.js";
import fs from "fs";
import ordermodel from "../models/ordermodel.js";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
})


export const createproductController = async (req, res) => {
    try {
        const { name, price, description, category, quantity } = req.fields;
        console.log(req);
        const { productPictures } = req.files;
//Validation
        if (!name || !price || !description || !category || !quantity  ) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (productPictures && productPictures.size > 500000) {
            return res.status(400).json({ message: "Product image is required less than 5 mb" });
        }


        const products = new productmodel({...req.fields, slug: slugify(name) });
        if (productPictures) {
            products.productPictures.data = fs.readFileSync(productPictures.path);
            products.productPictures.contentType = productPictures.type;
        }

        await products.save();
        res.status(201).json({ products, success: true, message: "Product created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error,
        success: false,
        message: "Error in creating product"
     })
    }
}

export const updateproductController = async (req, res) => {
    try {
        const { name, price, description, category, quantity } = req.fields;
    console.log(req);
    const { productPictures } = req.files;
//Validation
    if (!name || !price || !description || !category || !quantity  ) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (productPictures && productPictures.size > 500000) {
        return res.status(400).json({ message: "Product image is required less than 5 mb" });
    }


    const products = await productmodel.findByIdAndUpdate(req.params.pid, {...req.fields, slug: slugify(name) }, { new: true });
    if (productPictures) {
        products.productPictures.data = fs.readFileSync(productPictures.path);
        products.productPictures.contentType = productPictures.type;
    }

    await products.save();
    res.status(201).json({ products, success: true, message: "Product Updated successfully" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error,
        success: false,
        message: "Error in updating product"
        })
    }
}


export const getProductsController = async (req, res) => {
    try {
        const products = await productmodel.find({})
        .limit(12).sort({ createdAt: -1 });
        res.status(200).json({ products, success: true, message: "Products fetched successfully" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error,
        success: false,
        message: "Error in getting products"
        })
    }
}

export const getproductbySlugController = async (req, res) => {
    try {
        const product = await productmodel.findOne({ slug: req.params.slug })
        .select("-productPictures")
        .populate({ path: "category" });

        res.status(200).json({ product, 
            success: true, 
            message: "Single product fetched successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error,
        success: false,
        message: "Error in getting single product"
        })
    } 
}

export const getPhotoController = async (req, res) => {
    // console.log(req.params.pid , req);
    try {
        const product = await productmodel.findOne({ _id: req.params.pid });
        console.log(product);
        if (product.productPictures.data) {
            res.set("Content-Type", product.productPictures.contentType);
            return res.send(product.productPictures.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error,
        success: false,
        message: "Error in getting photo"
    })
    }
}

export const deleteProductController = async (req, res) => {
    try {
        await productmodel.findByIdAndDelete({ _id: req.params.pid }).select("-productPictures");
        res.status(200).json({ success: true, message: "Product deleted successfully" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error,
        success: false,
        message: "Error in deleting product"
        })
    }
}

export const filterProductsController = async (req, res) => {
    try {
        const {checked, radio} = req.body;
        console.log(checked, radio);
        let args = {};
        //checked=> more than one cat can be selected but price range only one
        if (checked.length > 0) args.category = checked
        if (radio) args.price = {$gte: radio[0], $lte: radio[1]}
        //execute query
        const products = await productmodel.find(args);
        res.status(200).json({ products, 
            success: true, 
            message: "Filtered products fetched successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error,
        success: false,
        message: "Error in filtering products"
        })
        
    }
}

export const getProductsCountController = async (req, res) => {
    try {
        const total = await productmodel.find({}).estimatedDocumentCount();
        res.status(200).json({ total, 
            success: true, 
            message: "Product count fetched successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error,
        success: false,
        message: "Error in getting product count"
    })
    }
}
   

export const getProductlistController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page || 1;
        const products = await productmodel
        .find({})
        .select("-productPictures")
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
        res.status(200).json({ products, 
            success: true, 
            message: "Product list fetched successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error,
        success: false,
        message: "Error in getting product list"
        })
    }
}

export const searchProductsController = async (req, res) => {
    try {
        const {keyword} = req.params;
        const results = await productmodel.find({
            $or: [
                {name: {$regex: keyword, $options: "i"}},
                {description: {$regex: keyword, $options: "i"}}
            ]
        }).select("-productPictures");
        res.status(200).json({ results, 
            success: true, 
            message: "Searched products fetched successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error,
        success: false,
        message: "Error in searching products"
        })
        
    }
}

export const similarProductsController = async (req, res) => {
    try {
        const {pid, cid} = req.params;
        console.log('Received params:', pid, cid);
        const product = await productmodel.findById(pid).populate("category");
        const products = await productmodel.find({
            _id: {$ne: product._id},
            category: cid
        }).limit(3).select("-productPictures").populate( "category" );
        res.status(200).json({ products, 
            success: true, 
            message: "Similar products fetched successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            error,
        success: false,
        message: "Error in getting similar products"
        })
    }
}

export const cwiseController = async (req,res)=> {
    try {
        const encodedSlug = encodeURIComponent(req.params.slug);
        console.log("Encoded Slug:", encodedSlug);

        const category = await categorymodel.findOne({ slug: encodedSlug });
        console.log("Category:", category);

        const products = await productmodel.find(category).populate("category");
        res.status(200).json({ products,
            category, 
            success: true, 
            message: "Category wise Product fetched successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error,
            success: false,
            message: "Error in Category wise Product"
        })
    }
}

//payment gateway
//token
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).json({ err,
                success: false,
                message: "Error in getting token"
                })
            } else {
                res.status(200).json({ response,
                success: true,
                message: "Token generated successfully"
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error,
        success: false,
        message: "Error in getting token"
        })
    }
}

//payment
export const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce} = req.body
        let total = 0
        cart.forEach ((i) => {total += i.price})
        let newTransaction = gateway.transaction.sale({
            amount:total,
            paymentMethodNonce: nonce,
            options:{
                submitForSettlement: true
            } },
            function(error, result){
                if (result) {
                    const order = new ordermodel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id
                    }).save()
                    res.json({ok:true})
                } else {
                    res.status(500).send(error)
                }
            } )
    } catch (error) {
        console.log(error);
        res.status(500).json({ error,
        success: false,
        message: "Error in payment"
        })
    }
}