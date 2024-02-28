const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const express = require('express');
const app = express();

// console.log('env---->', process.env)
// LOCAL
// const envPath = "secret/signlix_secret";
// dotenv.config({ path: envPath });    

global.CONFIG = {
	DIR_PATH: __dirname,
	rules: require("./config/rules"),
	bcrypt: require("./config/bcrypt"),
	app: require("./config/app"),
	mail: require("./config/mail"),
};
global.pathModule = require('path');

const cors = require("cors");
const fileUpload = require("express-fileupload");


//in-built middleware
app.use(cors);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(upload.any());
app.use(fileUpload());

// Initialize MongoDB Connection
const mongoose = require("./config/mongoose");


app.get('/test',(req,res)=>{
    return res.status(200).send({
        status:"success",
        message :"message send successfully..!!"
    })
})

app.listen(process.env.PORT, () => {console.log(`Server running on port ${process.env.PORT}/`);
});