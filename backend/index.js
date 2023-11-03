const express = require('express');
const app = express();
const dotenv = require('dotenv');
const port = 3000; // You can change the port to any available port you prefer
app.set('view engine', 'ejs');
const path = require("path");
app.use(express.urlencoded({ extended: true }));
//app.use(express.static('..//frontend'));
// Define a route that responds with "Hello, World!" for the root path

const mongoose = require('mongoose');



dotenv.config({ path: './file.env' });
const DB = process.env.DATABASE;


console.log(DB);

mongoose.connect(DB).then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log("not connected to database");
});


app.get('/', (req, res) => {
    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/home.ejs"));
});

app.get('/signup', (req, res) => {
    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/signup.ejs"));
});

app.get('/login', (req, res) => {
    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/login.ejs"));
});

app.post("/signup",(req,res)=>{
    const email=req.body.email;
    const username=req.body.username;
    const password=req.body.password;
    console.log(email+username+password);




})



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
