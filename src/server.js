require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const userRouter = require("./controllers/user.controller.js");

const connect = ()=>{
    return mongoose.connect(`mongodb+srv://STBUser:${process.env.STBUSER_PASSWORD}@stb-cluster.ojqel.mongodb.net/project0?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
}

app.get("/", async (req, res)=>{
    res.send({data: "hello"});
})

app.use("/user", userRouter);

app.listen(2244, async()=>{
    await connect();
    console.log("Listening at 2244");
})
