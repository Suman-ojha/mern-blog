const express = require('express');
const app = express();

app.get('/test',(req,res)=>{
    return res.status(200).send({
        status:"success",
        message :"message send successfully..!!"
    })
})

app.listen(5000 , ()=>{
    console.log('server running in 5000 port');
})