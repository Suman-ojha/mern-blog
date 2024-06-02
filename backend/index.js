const express = require('express');
const app = express();
require('dotenv').config();
// Initialize MongoDB Connection
require('./DB/connection')

 



// const cors = require("cors");
const fileUpload = require("express-fileupload");


//in-built middleware
// app.use(cors);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(upload.any());
app.use(fileUpload());

var basepath=''

//Global varibale declaration
global.basepath = basepath;
global.JWTSECRET = process.env.JWTSECRET;


//register the routes
app.use(basepath+ '/api/auth' , require('./Routes/authRoutes'))
app.use(basepath+ '/api' , require('./Routes/userRoutes'))



app.get('/test',(req,res)=>{
    return res.status(200).send({
        status:"success",
        message :"message send successfully..!!"
    })
})
app.get('/',(req,res)=>{
    return res.status(200).send({
        status:"success",
        message :"message send successfully..!!"
    })
})

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});