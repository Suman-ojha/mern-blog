const express = require('express');
const app = express();
require('dotenv').config();
// Initialize MongoDB Connection
require('./DB/connection')

 



const cors = require("cors");
const fileUpload = require("express-fileupload");


//in-built middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(upload.any());
app.use(fileUpload());
// app.use(cors);

var basepath=''

//Global varibale declaration
global.basepath = basepath;
global.JWTSECRET = process.env.JWTSECRET;


//register the routes
app.use(basepath+ '/api/auth' , require('./Routes/authRoutes'))
app.use(basepath+ '/api/user' , require('./Routes/userRoutes'))



app.get('/test',(req,res)=>{
    return res.status(200).send({
        status:"success",
        message :"message send successfully..!!"
    })
})
app.all('*', (req, res) => { 
    return res.status(404).send({
        status:"error",
        message :"<h1>404! Page not found</h1>"
    })
    
});

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});