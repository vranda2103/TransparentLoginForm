const express=require("express");
const path=require("path");
const app=express();
const port = 80;
const mongoose = require('mongoose');
const bodyparser=require("body-parser")
mongoose.connect('mongodb://localhost/transparentForm', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected")
});

const contactSchema = new mongoose.Schema({
    email: String,
    password: String
})

const Contact = mongoose.model('Contact',contactSchema);

app.use('/static',express.static('static')); //for serving static files
app.use(express.urlencoded());

app.set('view engine','pug');//set the template engine as pug
app.set('views',path.join(__dirname,'views'));

app.get('/',(req,res)=>{
    res.status(200).render('index.pug');
})

app.post('/',(req,res)=>{
    console.log(req.body);
    var myData = new Contact(req.body);
    myData.save().then(()=>{
        res.send("Item saved to database");
        
    }).catch(()=>{
        res.status(400).send("Item was not saved to the database");
    })
    res.redirect("/");
})

app.listen(port,() => {
    console.log(`port is ${port}`);
})