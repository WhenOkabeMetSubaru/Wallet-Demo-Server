const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction')
const crypto = require('crypto')
const razorInstance = require('../utils/razorpayinstance');

const getWalletByUserToken = async (req, res) =>
{
    try
    {


        let walletDetails = await Wallet.findOne({ user: req.user?._id });

        if (!walletDetails)
        {
            return res.status(404).json({
                status: true,
                info: "Wallet Not Found"
            })
        }

        return res.json({
            statsu: false,
            info: "Wallet Found",
            data: walletDetails
        })


    } catch (error)
    {
        return res.status(500).json({
            status: true,
            info: error.message
        })
    }
}

const addMoneyToWallet = async (req, res) =>
{
    try
    {

        let updatedDetails = await Wallet.findOneAndUpdate({ user: req.user._id }, {
            $inc: {
                amount: req.body.amount?.toFixed(2)
            }
        }, { new: true })

        if (!updatedDetails)
        {
            return res.status(500).json({
                status: true,
                info: "Could not add money to the wallet"
            })
        }


        let transactionObj = {
            transaction_type: "online",
            amount: req.body.amount,
            payment_mode: "online",
            user: req.user._id,
            wallet: updatedDetails?._id
        }

        let newTransaction = new Transaction(transactionObj);
        await newTransaction.save();


        return res.json({
            status: false,
            info: "Money Added Successfully",
            data: updatedDetails
        })

    } catch (error)
    {
        return res.status(500).json({
            status: true,
            info: error.message
        })
    }
}


const confirmAmount = async (req, res) =>
{
    try
    {

        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR",
        };
        const order = await razorInstance.orders.create(options);

        let wallet = await Wallet.findOne({user:req.user._id})

        let transactionObj = {
            user:req.user._id,
            razorpay_order_id:order.id,
            amount:order.amount,
            wallet:wallet._id,
            transaction_status:"pending",
            transaction_type:"online",
            amount_paid:0,
            amount_due:order.amount,

        }

        const newTransaction = new Transaction(transactionObj)
        await newTransaction.save();

        res.status(200).json({
            status: false,
            info: "Success",
            data: order,
        });
    } catch (error)
    {
        return res.status(500).json({
            status: true,
            info: error.message
        })
    }
}


const paymentVerification = async (req, res) =>
{
    try
    {

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;
        

        if (isAuthentic)
        {
            // Database comes here
            let authNew = 'Basic ' + Buffer.from("rzp_test_h29uCFs0FZuqn5" + ':' + "vTYEKFdaqkhwftISc2SCkumV").toString('base64')

            let resp = await fetch(`https://api.razorpay.com/v1/orders/order_Nh5vMPDNrYNSWo`, {
                method: "GET",
                headers: {
                    Authorization: authNew
                }
            })
            let orderDetails = await resp.json();

            let transactionDetails = await Transaction.findOne({razorpay_order_id});

            let updatedWallet = await Wallet.findByIdAndUpdate({_id:transactionDetails.wallet},{
                $inc:{
                    amount:(orderDetails?.amount_paid/100)
                }
            })


            let transactionObj = {
                razorpay_order_id,
                amount: orderDetails.amount,
                transaction_status: orderDetails.status,
                transaction_type: "online",
                amount_paid: orderDetails.amount_paid,
                amount_due: orderDetails.amount_due,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,

            }


            // await Transaction.create({
                // transaction_type:'online',
                // transaction_status:'paid',
                // razorpay_order_id,
                // razorpay_payment_id,
                // razorpay_signature,
            // });

            let updatedTransaction = await Transaction.findByIdAndUpdate({_id:transactionDetails._id},transactionObj,{new:true})

            res.json({
                status:false,
                info:orderDetails.status
            })
        } else
        {
            res.status(400).json({
                success: false,
            });

        }
    }
    catch (error)
    {
        res.status(500).json({
            status: true,
            info: error.message
        })
    }
}

const getRazorpayKey = async(req,res)=>{
    return res.json({
        status:false,
        info:"Success",
        data:process.env.RAZORPAY_KEY_ID
    })
}


module.exports = {
    addMoneyToWallet,
    getWalletByUserToken,
    confirmAmount,
    paymentVerification,
    getRazorpayKey
}