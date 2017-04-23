var express = require('express');
var router = express.Router();
var Users=require('../models/user');
var cookie=require('cookie');
var jwt=require('jsonwebtoken');
var member=require('../middleware/middleusers');


router.get('/',function (req,res,next) {

member.islogged(req,res,next).then(function(data){
      var ObjectId = require('mongoose').Types.ObjectId;
    var query = Users.findOne({_id: ObjectId(data._doc._id)});

    var pp = query.exec().then(function (data) {
                    console.log(data);
                 userdata = {
                    bankbalance: data.Bankbalance,
                    EthbalAvailable: data.EthbalAvailable
                }
                console.log(userdata);
                res.render('wallet', {userdata: userdata});   

    }).catch(function (err){
        console.log(err);
        res.redirect('/login');
    });

   
});
});



module.exports=router;
