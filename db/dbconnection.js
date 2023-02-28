const mongoose =require('mongoose')
require("dotenv").config()

mongoose.connect(process.env.DB_CONNECTION_STRING,{useUnifiedTopology:true},(err,res)=>{
    if(err){
        console.log('connection error',err);
    }
    else{
        console.log("Databse connection established");
    }
})