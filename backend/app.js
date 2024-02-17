const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const app = express();
const path = require('path')

// app.use(cors({
//     origin: 'http://localhost:3001', // Allow requests from this origin
//     credentials: true, // Allow cookies to be sent with the request
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: 'Content-Type,Authorization',
//     optionsSuccessStatus: 204,
// }));

app.use(cors({
    origin: 'https://patans-media.onrender.com/', // Allow requests from this origin
    credentials: true, // Allow cookies to be sent with the request
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    optionsSuccessStatus: 204,
}));

if(process.env.NODE_ENV !=='production'){
    require('dotenv').config({path:'backend/config/config.env'})
}

//using middlewares
app.use(cookieParser());
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb',extended:true}));

const post = require('./routes/post');
const user = require('./routes/user');

// using routes
app.use('/api/v1',post)
app.use('/api/v1',user)

app.use(express.static(path.join(__dirname, "./public")));

app.get("*",function(req,res){
  res.sendFile(path.join(__dirname,'../frontend/build/index.html'))
})

module.exports = app;
