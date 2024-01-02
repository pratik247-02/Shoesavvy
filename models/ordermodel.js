import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        products: [{
            type: mongoose.Schema.Types.ObjectID,
            ref: 'product'
    }],
    payment :{},
    buyer:{
        type: mongoose.Schema.Types.ObjectID,
        ref: 'user'
    },
    status:{    
        type: String,
        default: 'Not Processed',
        enum: ['Not Processed', 'Processing', 'Dispatched','Delieverd', 'Cancelled', 'Completed']
    },
    }

    , {timestamps: true}
)
export default mongoose.model('Order', OrderSchema)