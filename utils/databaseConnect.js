const mongoose = require('mongoose');

const connectToMongoServer = ()=>{
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("MongoDB Running Successfully")
    }).catch((e)=>{
        console.log(e.message)
    })
}

module.exports = connectToMongoServer