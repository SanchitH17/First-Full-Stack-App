const express = require("express")
const {connection} = require("./config/db")
const {UserModel} = require("./Models/UserModel")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { blogRouter } = require("./Routes/Blog.Router");
const {authentication} = require("./Middleware/Authentication")
require("dotenv").config()
const cors = require("cors")
const app = express();
app.use(express.json())
app.use(cors())


app.get('/' , (req, res)=>{
    try {
        res.send({Message: "BASE SERVER FOR YOUR API"})
    } catch (error) {
       console.log(error)
    }
})

app.post('/signup' ,async(req, res)=>{
   var {name , email , password, age , phonenumber} = req.body;
   bcrypt.hash(password,5 , async function(err, hash) {
    const newuser = new UserModel({
        name ,
        email , 
        password : hash,
        age ,
        phonenumber
   })
   await newuser.save()
   res.send({Message: "SignUP Successful"})
});          
})

app.post('/login' , async(req, res)=>{
    const {email , password} = req.body
   const user = await UserModel.findOne({email})
  

   if (!user) {
    return res.send({ Message: "Please Signup First" });
}
  else if(user){
    var token = jwt.sign({user_id: user._id }, process.env.secretkey);
        const hashed_password = user.password
        bcrypt.compare(password, hashed_password, function(err, result) {
         if(result){
            res.send({Message: "Login Successful"  , "token":token})
         }
         else{
            res.send({Message: "Invalid Credentials"})
         }
        });
   }
})
    app.use("/blogs" ,authentication, blogRouter)
app.listen(8080 , async(req , res)=>{
    try {
        await connection;
       
    } catch (error) {
        console.log("Server Error Connection")
    }
            console.log("Server Running On Port 8080")
})