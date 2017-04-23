/**
 * Created by ABC on 29-03-2017.
 */
/**
 * Created by ABC on 27-03-2017.
 */
/**
 * Created by ABC on 23-03-2017.
 */
var users=require('./user');

var mongoose=require('mongoose');


var bankmoney=mongoose.Schema({

    Userid:{
        type:String,
    },
    bankbalance:{
        type:Number,
        default:0
    },

    Tradedate: {
        type: Date, default: Date.now
    },
    transactionid:{
        type:String
    },
    fromwhichbank:{
        type:String
    },
    clientemail:{
        type:String
    }

});

var Bankmoney=module.exports=mongoose.model('Bankmoney',bankmoney);

module.exports.AddBankMoney=function (Bankmoney) {
    console.log('in bankmoney function'+ Bankmoney);
    Bankmoney.save(function (err,sucess) {
        if(!err){
            //update users bank balance
            updateuserbalance(Bankmoney.Userid,Bankmoney.bankbalance);
        }
    });
}

function updateuserbalance(userid,newbal) {
console.log('balance got' +newbal)
    console.log(' in user update userid' +userid);
    users.findOne({_id:userid},['Bankbalance'],function (err,data) {
        console.log('raw data of'+ data);
       var bbl=data.Bankbalance;
       console.log('bbl balance' +bbl);
       var nbbl=Number(bbl) + Number(newbal);

       users.update({_id:userid},{$set:{Bankbalance:nbbl}},function (err,result) {
           if(!err){
               console.log('bank balance updated');
           }else{
               console.log(err);
           }
       });

    });

    //return previous balance
}