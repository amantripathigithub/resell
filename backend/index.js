const express = require('express');
const app = express();
const dotenv = require('dotenv');
const multer = require('multer');
const port = 4000; 
app.set('view engine', 'ejs');
const path = require("path");
app.use(express.urlencoded({ extended: true }));
const users_resell = require('./model/user');
const city_resell = require('./model/city');
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
        users_resell.findOne({ email: userCookie })
        .then(async (userExist) => {
            if (userExist){
                //items = userExist.items;
                city = userExist.city;

                city_resell.findOne({ city:city })
        .then(async (cityExist) => {
            if (cityExist){
                
                items = cityExist.items;
                //console.log(items);
                app.use(express.static("../frontend"));
                return res.render(path.join(__dirname, "../frontend", "/home.ejs"),{email:userCookie,items:items});

            }else{
                app.use(express.static("../frontend"));
                return res.render(path.join(__dirname, "../frontend", "/home.ejs"),{email:userCookie,items:[]});
            }


        }).catch(err => { console.log(err); });

            }


        }).catch(err => { console.log(err); });


    }
else{
    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/login.ejs"));
}
    
});


app.post('/update_city', (req, res) => {

    var userCookie = "";
    var email = req.cookies.email;

    if(email){
        userCookie=email;
        users_resell.findOne({ email: userCookie })
        .then(async (userExist) => {
            if (userExist){
                //items = userExist.items;
                city = req.body.cityDrop;

                city_resell.findOne({ city:city })
        .then(async (cityExist) => {
            if (cityExist){
                
                items = cityExist.items;

               

                //console.log(items);
                app.use(express.static("../frontend"));
                return res.render(path.join(__dirname, "../frontend", "/home.ejs"),{email:userCookie,items:items});

            }else{
              
                app.use(express.static("../frontend"));
                return res.render(path.join(__dirname, "../frontend", "/home.ejs"),{email:userCookie,items:[]});
            }


        }).catch(err => { console.log(err); });

            }


        }).catch(err => { console.log(err); });


    }
else{
    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/login.ejs"));
}
    
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

                city = userExist.city;

                city_resell.findOne({ city:city })
        .then(async (cityExist) => {
            if (cityExist){
                
                items = cityExist.items;
                //console.log(items);
                app.use(express.static("../frontend"));
                return res.render(path.join(__dirname, "../frontend", "/home.ejs"),{email:email,items:items});

            }else{
                app.use(express.static("../frontend"));
                return res.render(path.join(__dirname, "../frontend", "/home.ejs"),{email:email,items:[]});
            }



        }).catch(err => { console.log(err); });

                
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
    const city = req.body.cityDrop;
    users_resell.findOne({ email: email, password: password })
        .then(async (userExist) => {
            if (userExist)
                return res.status(422).json({ error: "email exists already" });

            const user = new users_resell({ name: username, email: email, password: password, contact: contact,image:image,city:city, items:[]});



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
//console.log(userCookie);

users_resell.findOne({ email: userCookie })
.then(async (userExist) => {
    if (userExist)
       {
        temp = userExist.items;
        const image = req.file.filename;

        for(let i=0;i<temp.length;i++){
           if(temp[i].name.localeCompare(req.body.name) === 0 && temp[i].city.localeCompare(req.body.cityDrop) === 0 &&  temp[i].description.localeCompare(req.body.description) === 0 && parseInt(temp[i].cost) === parseInt(req.body.cost)){
            // console.log(temp[i].name.localeCompare(req.body.name) === 0 );
            // console.log(temp[i].city.localeCompare(req.body.cityDrop) === 0);
            // console.log(temp[i].description.localeCompare(req.body.description) === 0);
            // console.log(parseInt(temp[i].cost) === parseInt(req.body.cost));
            
               app.use(express.static("../frontend"));
              return  res.render(path.join(__dirname, "../frontend", "/myprofile.ejs"),{email:userCookie,user:userExist,items:temp});
            }
       }

        temp.push({name:req.body.name,cost:req.body.cost,city:req.body.cityDrop,status:0,description:req.body.description,image:image});
        try {
            const result = await users_resell.updateOne(
                { email: userCookie },
                {
                    $set: {
                        items:temp,
                    },
                }
            );
            //console.log(userExist.items);
            city_resell.findOne({city:req.body.cityDrop}).then(
                async(cityExist)=>{
                    const len = userExist.items.length;
                    if(cityExist){
                        

                        let temp_city = cityExist.items;
                        temp_city.push({id:userExist.items[len-1].id,email:email,name:req.body.name,cost:req.body.cost,city:req.body.cityDrop,status:0,description:req.body.description,image:image});
                        try {
                            const result_city = await city_resell.updateOne(
                                { city: req.body.cityDrop },
                                {
                                    $set: {
                                        items:temp_city,
                                    },
                                }
                            );
                        }catch (err) {
                            console.error(err);
                            res.status(500).send('Error updating city >> document'); // Handle the error and send a response
                        }
                    }else{
                        items=[{
                            id:userExist.items[len-1].id,email:email,name:req.body.name,cost:req.body.cost,city:req.body.cityDrop,status:0,description:req.body.description,image:image
                        }]
                        city = new city_resell({city:req.body.cityDrop,items:items});
                        city.save().then(() => {
                            
                         
               
                        }).catch((err) => res.status(500).json({ error: "failed to register !! " }));
            
                    }
                }
            )
            
    


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

       // console.log(status);

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
                //console.log("matched");
                
    break;
            }
            i++;
            
        }

        if(i<userExist.items.length){

            temp[i].cost=newPrice;
            temp[i].description=desc;
            temp[i].status=status;

            //console.log(temp[i].status);

            try {
                const result = await users_resell.updateOne(
                    { email: userCookie },
                    {
                        $set: {
                            items:temp,
                        },
                    }
                );


                    // update city
                    console.log(req.body.city)

                    city_resell.findOne({city:req.body.city}).then(
                        async(cityExist)=>{
                            
                            if(cityExist){
                                let temp_city = cityExist.items;
                               for(let i=0;i<cityExist.items.length;i++){
                                if(id.localeCompare(cityExist.items[i].id)===0){
                                    temp_city[i].cost=newPrice;
                                    temp_city[i].status=status;
                                    temp_city[i].description=desc;
                                    try {
                                        const result = await city_resell.updateOne(
                                            { city: req.body.city },
                                            {
                                                $set: {
                                                    items:temp_city,
                                                },
                                            }
                                        );
                        console.log("done");
                                    break;
                                }catch (err) {
                                    console.error(err);
                                    res.status(500).send('Error updating document'); // Handle the error and send a response
                                }
                               }
                               

                            }
                        }else console.log("city not in db");
                    }
                    )

    
    
    
                app.use(express.static("../frontend"));
        res.render(path.join(__dirname, "../frontend", "/myprofile.ejs"),{email:userCookie,user:userExist,items:temp});
            }catch (err) {
                console.error(err);
                res.status(500).send('Error updating document'); // Handle the error and send a response
            }
        }
            
       }


}).catch(err => { console.log(err); });

    }


   else {
        app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/login.ejs"));
       
    }
});


app.post('/ask_price', (req, res) => {

    var userCookie = "";
    var email = req.cookies.email;
    if(email){
        id = (req.body.item_id);
        askPrice = req.body.newPrice;




    }else{
        app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/login.ejs"));
    }

});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
