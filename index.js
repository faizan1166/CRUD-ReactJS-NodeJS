const express = require('express')
const app = express();
require("dotenv").config()
require('./db/dbconnection');
const userRouter = require('./routes/userRouter');

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use('/api/v1', userRouter)

app.listen(process.env.PORT, () => {
    console.log(`server is running on ${process.env.PORT}`);
})