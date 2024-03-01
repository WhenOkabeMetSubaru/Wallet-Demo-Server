const Transaction = require('../models/transaction');

const getAllTransactionByUser = async (req,res)=>{
    try {
        
        let transactionDetails = await Transaction.find({user:req.user._id});

        if(!transactionDetails?.length>0){
            return res.status(404).json({
                status:true,
                info:"Transaction Not Found"
            })
        }

        return res.json({
            status:false,
            info:"Transactions Found",
            data:transactionDetails
        })

    } catch (error) {
        return res.status(500).json({
            status:true,
            info:error.message
        })
    }
    
}

module.exports = {
    getAllTransactionByUser
}