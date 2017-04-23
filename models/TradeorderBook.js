/**
 * Created by ABC on 27-03-2017.
 */

var mongoose=require('mongoose');
var Q=require('q');


var tradeordersech=mongoose.Schema({
    Userid:{
        type:String,
    },
    ordertype:{
        type:String
    },
    numberofeth:{
        type:Number
    },
    pricepereth:{
        type:Number
    },
    EthbalAvailabe:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        default:'pending'
    },
    Tradedate: {
        type: Date, default: Date.now
    }

});

var TradeorderBook=module.exports=mongoose.model('TradeorderBook',tradeordersech);

module.exports.saveTradeorder=function (TradeorderBook,callback) {
    TradeorderBook.save(callback);
};

