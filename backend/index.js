const express = require('express');
const app = express();
const path = require('path')
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
const __dir = path.resolve()
//Global varibale declaration
global.basepath = basepath;
global.JWTSECRET = process.env.JWTSECRET;
//smtp credential
global.SMTPHOST = process.env.SMTPHOST;
global.SMTPUSERNAME = process.env.SMTPUSERNAME;
global.SMTPFROMMAIL = process.env.SMTPFROMMAIL;
global.SMTPPASSWORD = process.env.SMTPPASSWORD;
global.SMTPMETHOD = process.env.SMTPMETHOD;
global.SMTPPORT = process.env.SMTPPORT;

//app url
global.APP_URL = process.env.APP_URL;
//stripe secret key
global.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;



//register the routes
app.use(basepath+ '/api/auth' , require('./Routes/authRoutes'))
app.use(basepath+ '/api/user' , require('./Routes/userRoutes'))
app.use(basepath+ '/api/post' , require('./Routes/postRoutes'))
app.use(basepath+ '/api/comment' , require('./Routes/commentRoutes'))
app.use(basepath+ '/api' , require('./Routes/publicRoutes'))



app.get('/test',(req,res)=>{
    return res.status(200).send({
        status:"success",
        message :"message send successfully..!!"
    })
})

app.use(express.static(path.join(__dir, '/blog_frontend/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dir, 'blog_frontend', 'dist', 'index.html'));
});
app.all('*', (req, res) => { 
    return res.status(404).send({
        status:"error",
        message :"<h1>404! Page not found</h1>"
    })
    
});

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});