//jshint esversion:6
const env = require('dotenv').config();
///
const express = require('express'); 
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/usersDB');

const userSchema = new mongoose.Schema({
    email: { type: String },
    password: { type: String}
});


console.log(process.env.SECRET);

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFeilds: ['password'] });



const User = mongoose.model('User', userSchema);






app.get('/', function (req, res) {  
    res.render('home');
})

app.get('/login', function (req, res) {  

    
    res.render('login');
})

app.post('/login', function (req, res) {
    User.findOne({ email: req.body.username }, function (err, result) {
        if (err) { console.log(err); } else { 
            if (result) { 
                if (result.password == req.body.password) { 
                    res.render('secrets');
                }
            }
        }
    })
 });
app.get('/register', function (req, res) {  
    res.render('register');
})

app.post('/register', function (req, res) { 
    User({
        email: req.body.username,
        password: req.body.password 
    }).save(function (err) {
        if (err) {
            console.log(err);
        } else { 
            res.render('secrets');
        }
     });
});






app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

















app.listen(3000, () => {
    console.log('listening on port 3000');
 });