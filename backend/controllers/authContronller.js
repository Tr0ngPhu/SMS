const User = require('../models/User');
const Account = require('../models/AccountsSchema')
const jwt = require('jsonwebtoken');
const bcrypt= require('bcrypt');
let refreshTokens = [];
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const authContronllers ={
    //register
    registerUser: async(req, res)=>{
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            //create user
            const newUser = new User({
                username:req.body.username,
                email:req.body.email,
                role: req.body.role,
                vnu_id: req.body.vnu_id,
                gender:req.body.gender,
                phonenumber:req.body.phonenumber,
                date_of_birth:req.body.date_of_birth, 
                major: req.body.major
                // location: req.body.location
            });
            const user = await newUser.save();

            const newAccout = new Account({
                user: new ObjectId(user._id),
                email_id: req.body.email_id,
                password: hashed,
            });

            const account = await newAccout.save();
            res.status(200).json(account);
            // const {password, ...orther}= user._doc;
            // res.status(200).json({...orther});
            // res.status(200).json(orther);

        } catch (error) {
            res.status(500).json({message:error})
        }
    },
    // create token
    generateAccessToken:async(user)=>{
        return jwt.sign({
            id: user._id,
            role: user.role,
            faculty:user.faculty,
            major:user.major,
            admin: user.admin,
        },
        process.env.JWT_ACCESS_KEY,
        {expiresIn: "1h"}
        );
    },
    
    generateRefreshToken:(user)=>{
        return jwt.sign({
            id: user._id,
            role: user.role,
            admin: user.admin
        },
        process.env.JWT_REFRESH_KEY,
        {expiresIn: "365d"}
        );

    },

    //login
    loginUser: async(req, res)=>{
        try {
            const account = await Account.findOne({email_id: req.body.email_id}).populate('user');
            if(!account){
                return res.status(404).json('wrong email_id');
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                account.password
            );
            if(!validPassword){
                return res.status(404).json('wrong password');
            }
            if(account && validPassword){
                const accessToken= await authContronllers.generateAccessToken(account.user);
                const refreshToken= await authContronllers.generateRefreshToken(account.user)
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken,{
                    httpOnly: true,
                    secure: false,
                    path:'/',
                    sameSite:'strict',
                })
                const {password,...orther}= account._doc;
                const user = account.user._doc;
                res.status(200).json({...orther,user,accessToken});
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    },

    requestRefreshToken: async (req, res) => {
        //Take refresh token from user
        const refreshToken = req.cookies.refreshToken;
        //Send error if token is not valid
        if (!refreshToken) return res.status(401).json("You're not authenticated");
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Refresh token is not valid");
        }
        try {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(403).json("Refresh token không hợp lệ");
                }
    
                refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    
                try {
                    const newAccessToken = await authContronllers.generateAccessToken(user);
                    const newRefreshToken = authContronllers.generateRefreshToken(user);
    
                    refreshTokens.push(newRefreshToken);
    
                    res.cookie("refreshToken", newRefreshToken, {
                        httpOnly: true,
                        secure: false,
                        path: '/',
                        sameSite: "strict",
                    });
    
                    console.log('New Access Token:', newAccessToken);
                    res.status(200).json({
                        accessToken: newAccessToken
                    });
                } catch (error) {
                    console.log(error);
                    res.status(500).json("Lỗi trong quá trình tạo Access Token");
                }
            });
        } catch (err) {
            console.log(err);
            res.status(403).json("Refresh token không hợp lệ");
        }
        },

    // logout
    userLogoutContronller: async(req, res)=>{
        res.clearCookie('refreshToken');
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json('Logout SuccessFully')
    },

    getAccountController: async (req, res) => {
        try {
            const accounts = await Account.find().populate({ path: 'user' });
            
            // Use map to transform the array and exclude the password field
            const sanitizedAccounts = accounts.map(account => {
                const { password, ...other } = account._doc;
                return other;
            });
    
            res.status(200).json(sanitizedAccounts);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}
module.exports = authContronllers;