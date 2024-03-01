const razorpay = require('razorpay');


const razorInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
})

module.exports = razorInstance