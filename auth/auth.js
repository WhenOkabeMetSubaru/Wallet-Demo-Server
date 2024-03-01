const User = require('../models/user.model')
const jsonwt = require('jsonwebtoken');
const { expressjwt: jwt } = require('express-jwt');

const signin = async (req, res) =>
{
    try
    {
        

        let user = await User.findOne({ "email": req.body.email })

        if (!user)
        {
            return res.status(404).json({
                status: true,
                info: 'User not found'
            })
        }


        if (!user.authenticate(req.body.password))
        {
            return res.status(400).json({
                status: true,
                info: "Passwords do not match"
            })
        }


        const token = jsonwt.sign({ _id: user._id, user_type: user.user_type }, process.env.JWT_SECRET);
        // res.cookie("t",token,{expire:new Date() + 9999});

        return res.json({
            status: false,
            info: "Login Successful",
            token,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,

            }
        })
    } catch (err)
    {
        return res.status(500).json({
            status: true,
            info: err.message
        })
    }
}

const signout = (req, res) =>
{
    res.clearCookie("t");
    return {
        error: false,
        message: "Signed out"
    }
}

const requireSignin = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth',
    algorithms: ['RS256', 'sha1', 'HS256']
})

const hasAuthorization = (req, res, next) =>
{

    const authorized = req.profile && req.auth && req.profile._id == req.auth._id
    if (!(authorized))
    {
        return res.status(401).json({
            error: true,
            message: 'User not authorized'
        })

    }
    next()
}

module.exports = { signin, signout, requireSignin, hasAuthorization }