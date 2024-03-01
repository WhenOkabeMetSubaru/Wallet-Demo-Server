const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    amount:{
        type:Number,
        default:0.00
    },
    active:{
        type:Boolean,
        default:true
    },
    verified:{
        type:String,
        enum:['none','pending','approved','rejected','failed'],
        default:'none'
    },
    deposit_amount:{
        type:Number
    },
    transaction:{
        type:mongoose.Schema.ObjectId,
        ref:"Transaction"
    }
   

},{timestamps:true})


module.exports = mongoose.model("Wallet",walletSchema);