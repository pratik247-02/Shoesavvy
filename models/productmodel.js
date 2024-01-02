import mongoose from "mongoose";

const productSchema = mongoose.Schema({

    name: {
        type:String,
        required: true,
        },
    slug: {
        type: String
    },
    price:{
        type:Number,
        required: true,
        trim: true
    },
    description: {
        type:String,
        required: true,
        trim: true
    },

    category: {
        type: mongoose.ObjectId,
        ref: "Category",
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    productPictures: {
        data: Buffer,
        contentType: String
    },

    shipping: {
        type: Boolean,
    }
},
        {timestamp: true} 
);

export default mongoose.model("product", productSchema);