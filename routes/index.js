var express = require('express');
var keythereum=require('keythereum');
var router = express.Router();
var jwt=require('jsonwebtoken');
var User=require('../models/user');

var member=require('../middleware/middleusers');

/* GET home page. */
router.get('/', function(req, res, next) {
member.islogged(req,res,next).then(function (data){

res.render('index', { title: 'Express' });
}).catch(function (err){
res.render('index', { title: 'Express' });
});
  
});

router.get('/login',function(req,res,next){
  res.render('login');
});

router.get('/register',function(req,res,next){
res.render('register');
});

router.get('/about',function(req,res,next){
    member.islogged(req,res,next).then(function (data){
        res.render('about');
    }).catch(function (err){

    });
});


router.get('/contact',function(req,res,next){
        member.islogged(req,res,next).then(function (data){

res.render('contact');
        }).catch(function (err){

        });
});

router.get('/logout',function (req,res,next) {

    res.cookie('auth','');

    res.redirect('/');
});


router.post('/register',function(req,res,next){

  var params = { keyBytes: 32, ivBytes: 16 };
    var dk = keythereum.create(params);
    var keypass = "wheethereum";
    var kdf = "pbkdf2";

    var options = {
        kdf: "pbkdf2",
        cipher: "aes-128-ctr",
        kdfparams: {
            c: 262144,
            dklen: 32,
            prf: "hmac-sha256"
        }
    };



    var keyObject = keythereum.dump(keypass, dk.privateKey, dk.salt, dk.iv, options);

    var fname=req.body.first_name;
    var lname=req.body.last_name;
    var email=req.body.email;
    var passi=req.body.password;
    var mobile=req.body.mobile;

    req.checkBody('first_name','name is required').notEmpty();
    req.checkBody('last_name','last name is required').notEmpty();
    req.checkBody('email',' email is required').notEmpty();
    req.checkBody('email',' input valid email').isEmail();
    req.checkBody('password',' password is required').notEmpty();
//req.checkBody('password_confirmation',' password shoud match').equals(req.checkBody.password);
    req.checkBody('mobile',' MobileNumber is required').notEmpty();

    var customerror=req.validationErrors(true);

    console.log(customerror);
    if (customerror){
        console.log(customerror);
        res.render('register',{
            customerror:customerror
        });

    }else{
            var newuser=new User({
            first_name:fname,
            last_name:lname,
            password:passi,
            email:email,
            mobile:mobile,
            ethpublickey:keyObject.address,
            ethbufpvt:'', //keyObject.privatekey,
            Ethobj:JSON.stringify(keyObject)
        });
User.Creatuser(newuser,function (err,usr) {

            if (err){
                console.log(err);
            }else{

                jwt.sign(newuser,'amingandu',{expiresIn:'20h'},function (err,data) {
                    res.cookie('auth',data);

                    return res.redirect('/dashboard/');
                });

            }
});

    
  

}});

router.post('/login',function(req,res,next){
//res.redirect('dashboard');

  query={email: req.body.email,password:req.body.password};
    console.log(query);

    User.findOne(query,['_id','email','first_name', 'last_name','urole'],function (err,users) {
        console.log(users);
        // var token=jwt.sign(users, 'amingandu',{expiresIn:'20h'});
        //res.status(200).json(mm);
        jwt.sign(users,'amingandu',{expiresIn:'20h'},function (err,data) {
            if(err){
                console.log(' error username and password');
                res.redirect('/login');
                next();
            } else {
                res.cookie('auth', data);
                return res.redirect('/dashboard/');
            }
        });

    });
        // return res.send('ok');

});




module.exports = router;
