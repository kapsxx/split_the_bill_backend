const { response } = require("express");
const express = require("express");
const userRouter = express.Router();
const{body, validationResult} = require("express-validator");
const Authentication = require("../middlewares/Authentication.js");
const Authorize = require("../middlewares/Authorization.js");

const User = require("../models/user.model.js");

userRouter.get("/", async (req, res)=>{
    const data = await User.find().lean().exec();
    res.send({data: data});
})

// userRouter.post("/", 
// body("email").custom(value => {
//     return User.find({email: value}).then(user => {
//         if(user.length!=0){
//             // console.log("user", user);
//             return Promise.reject("Email already exists");
//         }
//     })
// }), 
// async (req, res, next)=>{
//     const errors = validationResult(req);

//     if(!errors.isEmpty()){
//         res.send({data: errors})
//     }

//     else{
//         const data = await User.create(req.body);
//         res.send({data: data});
    
//         next();
//     }
// })

userRouter.post("/", 
body("email").custom(value => {
    return User.find({email: value}).then(user => {
        if(user.length!=0){
            // console.log("user", user);
            return Promise.reject("Email already exists");
        }
    })
}), 
async (req, res, next)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.send({data: errors})
    }

    else{
        try {
            const data = await User.create(req.body);
            res.send({data: data});
            next();
        } catch (error) {
            res.send({data: "something went wrong while creating the user"});
        }
    }
})

userRouter.get("/hash/:hash", async(req, res)=>{
    const hash = req.params.hash;
    // console.log("hash", hash);

    const temp = await User.findOne( { "bill_array.hash": hash } ).lean().exec();
    // console.log("data", temp);

    let data;

    if(temp){
        for(let i=0; i<temp.bill_array.length; i++){
            if(temp.bill_array[i].hash==hash){
                data = temp.bill_array[i];
            }
        }
    }

    res.send({data: data});
})

userRouter.get("/invoice/:tkn", Authorize, async(req, res)=>{

    const id = req.user.user._id;

    const temp = await User.findById(id).lean().exec();

    const data = temp.bill_array;

    res.send({data: data});
})

userRouter.post("/login", Authentication, async(req, res)=>{
    res.send({token: req.token});
})

userRouter.post("/upload/:tkn", Authorize, async(req, res)=>{
    const id = req.user.user._id;

    const temp = await User.findById(id).lean().exec();
    const temp_bill_array = temp.bill_array;

    const data = await User.findByIdAndUpdate(id, {
        bill_array: [...temp_bill_array, req.body]
    })

    res.send({data: data});
})

// userRouter.post("/upload", Authorize, async (req, res)=>{
//     const id = req.user.user._id;
//     // console.log("id", id);

//     const temp = await User.findById(id).lean().exec();
//     const temp_bill_array = temp.bill_array;

//     // const body = {
//     //     "statement": {
//     //         "comodity_array": ["food", "taxi"],
//     //         "paidBy_array": ["kapil", "ajino"],
//     //         "price_array": ["12", "55"]
//     //     },
//     //     "hash": "qwerty123",
//     //     "invoice_date": "11/01/1998"
//     // }

//     const data = await User.findByIdAndUpdate(id, {
//         bill_array: [...temp_bill_array, req.body]
//     })

//     res.send({data: data});
// })

module.exports = userRouter;
