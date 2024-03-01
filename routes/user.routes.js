
const AdminAuthCtrl = require('../auth/auth');
const UserCtrl = require('../controllers/user.controller');
const WalletCtrl = require('../controllers/wallet.controller')
const TransactionCtrl = require('../controllers/transaction.controller')
const Router = require('express').Router();



Router.route('/v1/signup')
    .post(UserCtrl.addNewUser);

Router.route('/v1/signin')
    .post(AdminAuthCtrl.signin)

Router.route('/v1/users')
    .get(AdminAuthCtrl.requireSignin, UserCtrl.getAllUsers)

Router.route('/v1/user/single')
    .get(AdminAuthCtrl.requireSignin, UserCtrl.getUserByToken)

Router.route('/v1/user/:userId')
    .get(AdminAuthCtrl.requireSignin, AdminAuthCtrl.hasAuthorization, UserCtrl.getUserByID);

Router.route('/v1/user/update')
    .patch(AdminAuthCtrl.requireSignin, UserCtrl.getUserByTokenPass, UserCtrl.updateUser);

Router.route('/v1/user/wallet/addmoney')
    .post(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,WalletCtrl.addMoneyToWallet)

Router.route('/v1/user/wallet/details')
    .get(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,WalletCtrl.getWalletByUserToken)

Router.route('/v1/user/create/order')
    .post(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,WalletCtrl.confirmAmount)

Router.route('/v1/user/payment/verification')
    .post(WalletCtrl.paymentVerification)

Router.route('/v1/user/payment/key')
    .get(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,WalletCtrl.getRazorpayKey)

Router.route('/v1/user/transactions/all')
    .get(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,TransactionCtrl.getAllTransactionByUser)

module.exports = Router;