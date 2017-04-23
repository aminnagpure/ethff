/**
 * Created by ABC on 29-03-2017.
 */
var express = require('express');
var router = express.Router();
var AddBankMoney=require('../models/bankmoney');

var Users=require('../models/user');





router.get('/',function (req,res,next) {
    res.render('addmoney');

});

router.post('/addmoney',function (req,res,next) {

    var email=req.body.email;
    var amt=req.body.amt;




    req.checkBody('email','name is required').notEmpty();
    req.checkBody('amt','last name is required').notEmpty();

    var customerror=req.validationErrors(true);


    if (customerror){
        console.log(customerror);
        res.render('addmoney',{
            customerror:customerror
        });

    }
    else{
        console.log('in elkse condition');

        Users.findOne({},['email'],function (err,result) {


        if(!err){
            var addbankmoney = new AddBankMoney({
                Userid:result._id,
                clientemail: email,
                bankbalance: amt
            });


            console.log('in no error function'+addbankmoney);

            AddBankMoney.AddBankMoney(addbankmoney,function (err,result) {
               return result;
            });

        }
    });
        
        
    }

});



//User = mongoose.model('User'); // Declare a new mongoose User

router.get('/search_member', function(req, res) {
   var regex = new RegExp(req.query["term"], 'i');
   var query = User.find({email: regex}); //.sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
       
      // Execute query in a callback and return users list
  query.exec(function(err, users) {
      if (!err) {
         // Method to construct the json result set
         var result = buildResultSet(users);
         res.send(result, {
            'Content-Type': 'application/json'
         }, 200);
      } else {
         res.send(JSON.stringify(err), {
            'Content-Type': 'application/json'
         }, 404);
      }
   });
});


module.exports = router;