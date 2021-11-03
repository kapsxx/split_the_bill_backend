require('dotenv').config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function Authentication(req, res, next){
    const user = await User.findOne({email: req.body.email}).lean().exec();
    if(user && user.password==req.body.password){
        const token = jwt.sign({user}, process.env.JWT_KEY);
        req.token = token;
        next();
    }

    else{
        res.send({data: "wrong email or password"});
    }
}

module.exports = Authentication;
