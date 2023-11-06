const express = require('express');
const app = express();
const dotenv = require('dotenv');
const multer = require('multer');
const port = 4000; 
app.set('view engine', 'ejs');
const path = require("path");
app.use(express.urlencoded({ extended: true }));
const users_resell = require('./model/user');
const mongoose = require('mongoose');
const fs = require('fs');
const cookieParser = require('cookie-parser'); 
app.use(cookieParser());

dotenv.config({ path: './file.env' });
const DB = process.env.DATABASE;

const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

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



app.get('/logout', (req, res) => {
    var email="";
    res.clearCookie('email');
    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/home.ejs"),{email:email});
});

app.get('/myprofile', (req, res) => {

    var userCookie = "";
    var email = req.cookies.email;

    if(email){
        userCookie=email;
    }

    users_resell.findOne({ email: userCookie })
        .then(async (userExist) => {
            if (userExist){
                items = userExist.items;
                app.use(express.static("../frontend"));
                res.render(path.join(__dirname, "../frontend", "/myprofile.ejs"),{email:userCookie,user:userExist,items:items});

            }


        }).catch(err => { console.log(err); });


    
});

app.get('/add', (req, res) => {

    var userCookie = "";
    var email = req.cookies.email;

    if(email){
        userCookie=email;
    }
    


    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/add.ejs"),{email:userCookie});
});

// Set up Multer for image uploads

app.use(express.static('../frontend/static'));


var storage = multer.diskStorage({
    destination: "../frontend/static",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))

    }
})



var upload = multer({
    storage: storage
}).single('image');




app.post("/signup",upload,(req,res)=>{
    const email=req.body.email;
    const username=req.body.username;
    const password=req.body.password;
    const contact = req.body.contact;
    const image = req.file.filename;
    users_resell.findOne({ email: email, password: password })
        .then(async (userExist) => {
            if (userExist)
                return res.status(422).json({ error: "email exists already" });

            const user = new users_resell({ name: username, email: email, password: password, contact: contact,image:image, items:[]});



            user.save().then(() => {
                app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/login"));
   
            }).catch((err) => res.status(500).json({ error: "failed to register !! " }));


        }).catch(err => { console.log(err); });

})




app.post('/add', upload, (req, res) => {
    var userCookie = "";
    var email = req.cookies.email;

    if (email) {
        userCookie = email;
    }
console.log(userCookie);




users_resell.findOne({ email: userCookie })
.then(async (userExist) => {
    if (userExist)
       {
        temp = userExist.items;
        const image = req.file.filename;
        temp.push({name:req.body.name,cost:req.body.cost,city:req.body.city,status:0,description:req.body.description,image:image});
        try {
            const result = await users_resell.updateOne(
                { email: userCookie },
                {
                    $set: {
                        items:temp,
                    },
                }
            );



            app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/myprofile.ejs"),{email:userCookie,user:userExist,items:temp});
        }catch (err) {
            console.error(err);
            res.status(500).send('Error updating document'); // Handle the error and send a response
        }
       }


}).catch(err => { console.log(err); });


    
});




app.post('/details', (req, res) => {
    var userCookie = "";
    var email = req.cookies.email;

    if (email) {
        userCookie = email;
        const id=req.body.itemId;
        users_resell.findOne({ email: userCookie })
.then(async (userExist) => {
    if (userExist)
       {
        temp = userExist.items;
        //const image = req.file.filename;
        let i=0;

        //temp.push({name:req.body.name,cost:req.body.cost,city:req.body.city,status:0,description:req.body.description,image:image});
        while(i<userExist.items.length){
            
            result = id.localeCompare(userExist.items[i]._id);
            if(!result){
                console.log("matched");
                app.use(express.static("../frontend"));
   return res.render(path.join(__dirname, "../frontend", "/details.ejs"),{email:userCookie,item:userExist.items[i]});
                
    break;
            }
            i++;
            
        }
            
       }


}).catch(err => { console.log(err); });


    }else {
        app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/login.ejs"));
       
    }

    
});


app.post('/update_product', (req, res) => {

    var userCookie = "";
    var email = req.cookies.email;

    if(email){
        userCookie=email;

        const id = req.body.itemId;
        const newPrice = req.body.newPrice;
        const desc = req.body.newDescription;
        const status = req.body.newStatus;

        console.log(status);

        

    }
    


    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/home.ejs"),{email:email});
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
