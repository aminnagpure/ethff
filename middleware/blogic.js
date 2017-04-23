/**
 * Created by ABC on 04-04-2017.
 */
var Trades=require('../models/TradeorderBook');
var Q=require('q');
var Tradehistory=require('../models/tradehistory');
var Users=require('../models/user');

//var tradebuyersbook
module.exports.matchorders=function (callback) {
    //var defer=Q.defer();
var pricepereth,noofeth;

    Trades.find({ordertype:'buy',status:'pending'}, ['_id', 'numberofeth', 'pricepereth','Userid'],function (err,data) {
        
            for (i = 0; i < data.length; i++) {
                console.log(data);

                pricepereth = data[i].pricepereth
                noofeth = data[i].numberofeth
                callback(pricepereth,noofeth,data[i].Userid);
            }

        });
    
  

};

module.exports.executeorder= function(peth,noofeth,buyeruserid) {

    Trades.find({ordertype:'sell',status:'pending',pricepereth:peth}, ['_id', 'numberofeth', 'pricepereth','Userid'], function (err, data) {
        if (err) {
            console.log(err);
        } else {

//order matched
            for (i = 0; i < data.length; i++) {
                pricepereth = data[i].pricepereth;
                noofeth = data[i].numberofeth;
                insertorder(peth,noofeth,buyeruserid,data[i].Userid);
            }

        }
    });

};

function insertorder(peth,noofeth,buyeruserid,selleruserid) {
    var sellorder = new Tradehistory({
        UseridBuyer: buyeruserid,
        UseridSeller:selleruserid,
        numberofethTraded: noofeth,
        priceperethTraded: peth,
        TotalAmtdealinRs: 3434

    });

    Tradehistory.AddTradeHistory(sellorder,function (err,byr) {
        if (err){
            console.log(err);
        }

        var success_msg='you are registered';
    });


};

module.exports.deleteTradeorder=function(orderid,userid){
    var defer=Q.defer();
Trades.remove({_id:orderid,Userid:userid}).then(function(data){
 defer.resolve(data);
}).catch(function (err){
    defer.reject(err);
    console.log(err);
});
return defer.promise;
};

module.exports.BuyorderAddFunds=function(orderid,userid){

}

module.exports.ExecuteEthBuy=function(userid,ethtobuy,priceperth,Bankbalance){
         var defer=Q.defer();
            
            var buyorder = new Trades({
            Userid: userid,
            ordertype: 'buy',
            numberofeth: numberofeth,
            pricepereth: pricepereth
            

        });

        Trades.saveTradeorder(buyorder, function (err, byr) {
            if (err) {
                console.log(err);
                defer.reject(err);
            }else{
                //res.io.emit("buyorderfired", byr);
                 defer.resolve(byr);


            }

});
return defer.promise;

}

module.exports.checkuserbalance=function(userid,pricepereth,noofeth){
    var defer=Q.defer();

    var ObjectId = require('mongoose').Types.ObjectId;
       
         

            //var promm=new Promise
        
       var query= Users.findOne({_id:ObjectId(userid)});
       
        //assert.equal(query.exec().constructor, global.Promise);

       
       var pp=query.exec().then(function (data){
      //  console.log(data);
        defer.resolve(data);
       }).catch(function (err){
           defer.reject(err);
       });
       
            
         
    return defer.promise;

}