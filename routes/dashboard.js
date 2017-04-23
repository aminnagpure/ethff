var express = require('express');
var router = express.Router();

var Trades=require('../models/TradeorderBook');
var tradehistory=require('../models/tradehistory');
var member=require('../middleware/middleusers');
var Users=require('../models/user');

router.get('/',function(req,res,next){


  try {


member.islogged(req,res,next).then(function (data) {
     res.io.emit("news", "users");

    res.render('dashboard',{namespace:data._id });
}).catch(function (err) {
   return res.redirect('/login');
});

    }catch (err){
        console.log(err);
        return res.redirect('/login');
    }

});

router.get('/sellethorder',function(req,res,next){
Trades.find({ordertype:'sell'}, ['_id', 'numberofeth', 'pricepereth'], function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.send(JSON.stringify(data));
            //console.log(data);
        }
        
    });

});

router.get('/tradehistory',function(req,res,next){
  tradehistory.find({}, ['_id', 'numberofethTraded', 'priceperethTraded'], function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.send(JSON.stringify(data));
            //console.log(data);
        }
    });


});

router.get('/yourpendingorders',function (req,res,next) {
    member.islogged(req, res, next).then(function (data) {

        Trades.find({
            $and: [{status: 'pending', Userid: data._doc._id}]
        }, ['_id', 'ordertype','numberofeth', 'pricepereth'], function (err, data) {
            if (err) {
                console.log(err);
            } else {
                res.send(JSON.stringify(data));
                //console.log(data);
            }

        });
    }).catch(function (dataq) {
        console.log(data);
        res.redirect('login');
    });
});
router.get('/buyorders',function (req,res,next) {
    //console.log(req.cookies['cid']);
        Trades.find({ordertype:'buy'}, ['_id', 'numberofeth', 'pricepereth'], function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.send(JSON.stringify(data));
            //console.log(data);
        }
        
    });

});



router.get('/delorder',function (req,res,next) {
    member.islogged(req,res,next).then(function (data) {
        console.log(req.query.id);
        console.log('userid'+ data._doc._id);
        Trades.remove({_id:req.query.id,Userid:data._doc._id}).then(function (data){
            console.log(data);
            res.redirect('/dashboard');

        }).catch(function (err){
                console.log(err);
        });
    }).catch(function (err){
        console.log(err);
    });


});

router.post('/buy',function (req,res,next) {


    req.checkBody('numberofeth', 'Number of Eth Cannot be Empty').notEmpty();
    req.checkBody('pricepereth', 'Price of Eth Cannot be Empty ').notEmpty();

    var customerror = req.validationErrors(true);
    if (customerror) {
        console.log(customerror);
        res.redirect('dashboard', {
            customerror: customerror
        });

    }else {
        var numberofeth = req.body.numberofeth;
        var pricepereth = req.body.pricepereth;

        member.islogged(req, res, next)
            .then(function (data) {
                console.log(data);


                var ObjectId = require('mongoose').Types.ObjectId;


                //var promm=new Promise

                var query = Users.findOne({_id: ObjectId(data._doc._id)});


                var pp = query.exec().then(function (data) {
                    console.log(data);

                    var bankbalance = data._doc.Bankbalance;
                    if (bankbalance >= numberofeth * pricepereth) {
                        //execute the code

                        var buyorder = new Trades({
                            Userid: data._doc._id,
                            ordertype: 'buy',
                            numberofeth: numberofeth,
                            pricepereth: pricepereth
                        });

                        Trades.saveTradeorder(buyorder, function (err, byr) {
                            if (err) {
                                console.log(err);

                            } else {

                                //minus the amount from his bank balance
                                console.log(bankbalance - byr.numberofeth * byr.pricepereth);
                                Users.findByIdAndUpdate({_id: byr.Userid}, {$set: {Bankbalance: bankbalance - byr.numberofeth * byr.pricepereth}}, function (err, data) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('result data is' + data);
                                        
                                    }
                                });

                                blogic.matchorders(blogic.executeorder);    
                                console.log('order executed');
                                res.redirect('/dashboard');


                            }
                        });
                    } else {
                        res.io.emit("notenoughbalance");
                        console.log('not enough bank balance');
                    }

                });
            }).catch(function (err) {
            console.log(err);
        });
    }});
router.post('/sell',function (req,res,next) {
    //console.log(req.cookies)

    member.islogged(req,res,next).then(function (data) {
        var numberofeth=req.body.numberofeth;
        var pricepereth=req.body.pricepereth;



        req.checkBody('numberofeth','last name is required').notEmpty();
        req.checkBody('pricepereth',' email is required').notEmpty();
        
        
        var customerror=req.validationErrors(true);
        if (customerror){
            console.log(customerror);
            res.direct('dashboard',{
                customerror:customerror
            });

        }
        else {

        var numberofeth = req.body.numberofeth;
        var pricepereth = req.body.pricepereth;

        member.islogged(req, res, next)
            .then(function (data){
                  var ObjectId = require('mongoose').Types.ObjectId;
                var query = Users.findOne({_id: ObjectId(data._doc._id)});


                var pp = query.exec().then(function (data) {
                    console.log(data);

                    var ethbalance = data._doc.EthbalAvailabe;
                    if (ethbalance >= numberofeth) {
                        //execute the code

                        var sellorder = new Trades({
                            Userid: data._doc._id,
                            ordertype: 'sell',
                            numberofeth: numberofeth,
                            pricepereth: pricepereth
                        });

                        Trades.saveTradeorder(sellorder, function (err, byr) {
                            if (err) {
                                console.log(err);

                            } else {

                                //minus the amount from his bank balance
                                //console.log(ethbalance - byr.numberofeth * byr.pricepereth);
                                Users.findByIdAndUpdate({_id: byr.Userid}, {$set: {EthbalAvailabe: ethbalance - byr.numberofeth}}, function (err, data) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('result data is' + data);
                                    }
                                });

                                console.log('order executed');

                                // execute order match orders and execute

                                res.redirect('/dashboard');

                            }});
                    }});
            }).catch(function (err){
                console.log(err);
            });


        }});
});

     


module.exports=router;