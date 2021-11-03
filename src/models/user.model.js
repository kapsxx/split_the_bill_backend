const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, require: true},
    bill_array: [{type: Object, required: false}]
})

const User = mongoose.model("users",  userschema);

module.exports = User;
