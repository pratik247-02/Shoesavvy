import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type:String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true,
        unique: true
    },
    address: {
            type:{},
            required: true,
            trim: true
    },
        
    phone : {
        type:Number,
        required: true,
        
    },

    secretquestion: {
        type: String,
        required: true,
    },

    role: {
        type: String,
    },
} );

export default mongoose.model("user", userSchema);