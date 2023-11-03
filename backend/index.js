const express = require('express');
const app = express();
const dotenv = require('dotenv');
const port = 4000; 
app.set('view engine', 'ejs');
const path = require("path");
app.use(express.urlencoded({ extended: true }));
const users_resell = require('./model/user');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser'); 
app.use(cookieParser());

dotenv.config({ path: './file.env' });
const DB = process.env.DATABASE;


mongoose.connect(DB).then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log("not connected to database");
});



app.get('/', (req, res) => {

    var userCookie = "";
    var email = req.cookies.email;

    if(email){
        userCookie=email;
    }

    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/home.ejs"),{email:userCookie});
});

app.get('/signup', (req, res) => {
    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/signup.ejs"));
});

app.get('/login', (req, res) => {
    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/login.ejs"));
});

app.post('/login', (req, res) => {
    const email=req.body.email;
    const password=req.body.password;

    users_resell.findOne({ email: email, password: password })
        .then(async (userExist) => {
            if (userExist){
                // set up cookie
                const thirtyMinutes = 30 * 60;
                res.cookie('email', email,{maxAge: thirtyMinutes * 1000 });


                app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/home"),{email:email});
            }else{
                app.use(express.static("../frontend"));
   return res.render(path.join(__dirname, "../frontend", "/signup.ejs"));
            }


        }).catch(err => { console.log(err); });


});

app.post("/signup",(req,res)=>{
    const email=req.body.email;
    const username=req.body.username;
    const password=req.body.password;
    const contact = req.body.contact;
    
    users_resell.findOne({ email: email, password: password })
        .then(async (userExist) => {
            if (userExist)
                return res.status(422).json({ error: "email exists already" });

            const user = new users_resell({ name: username, email: email, password: password, contact: contact});


            user.save().then(() => {
                app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/login"));
   
            }).catch((err) => res.status(500).json({ error: "failed to register !! " }));


        }).catch(err => { console.log(err); });

})

app.get('/logout', (req, res) => {
    var email="";
    res.clearCookie('email');
    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/home.ejs"),{email:email});
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
