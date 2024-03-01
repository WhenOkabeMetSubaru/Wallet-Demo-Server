const mongoose = require('mongoose');
const pagination = require("mongoose-paginate-v2")


const transactionSchema = new mongoose.Schema({
    transaction_type:{
        type:String,
        enum:['online','offline','none'],
        default:'none'
    },
    transaction_status:{
        type:String,
        enum:['failed','paid','progressing','pending','rejected','none'],
        default:'none'
    },
    amount:{
        type:Number,
        default:0
    },
   
    payment_mode: {
        type: String
    },
    amount_paid: {
        type: Number
    },
    amount_due: {
        type: Number
    },
    sender_name: {
        type: String
    },
    receiver_name: {
        type: String
    },
    third_party_service_name:{
        type:String
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    wallet:{
        type:mongoose.Schema.ObjectId,
        ref:"Wallet"
    },
    created:{
        type:Date,
        default:Date.now()
    },
    razorpay_order_id: {
        type: String,
        
    },
    razorpay_payment_id: {
        type: String,
       
    },
    razorpay_signature: {
        type: String,
     
    },
})

transactionSchema.plugin(pagination)

module.exports = mongoose.model("Transaction",transactionSchema);