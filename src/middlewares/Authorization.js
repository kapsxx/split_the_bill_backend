require('dotenv').config();
const jwt = require("jsonwebtoken");

// function Authorize(req, res, next){
//     const token = req.headers.authorization.split(" ")[1];

//     // console.log("token", token);

//     try {
//         const user = jwt.verify(token, "key");
//         // console.log("user", user);
//         req.user = user;
//         next();
//     } catch (error) {
//         res.send({data: "something went wrong from auth middleware"});
//     }
// }

function Authorize(req, res, next){
    const token = req.params.tkn;

    // console.log("token", token);

    try {
        const user = jwt.verify(token, process.env.JWT_KEY);
        // console.log("user", user);
        req.user = user;
        next();
    } catch (error) {
        res.send({data: "something went wrong from auth middleware"});
    }
    
}



module.exports = Authorize;
