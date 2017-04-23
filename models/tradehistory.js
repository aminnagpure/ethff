var mongoose=require('mongoose');


var tradeorderhistoryschema=mongoose.Schema({
    UseridBuyer:{
        type:String,
    },
    UseridSeller:{
        type:String,
    },

    numberofethTraded:{
        type:Number
    },
    priceperethTraded:{
        type:Number
    },

    TotalAmtdealinRs:{
       type:Number
    },
    Tradedate: {
        type: Date, default: Date.now
    }

});

var TradeorderBookHistory=module.exports=mongoose.model('TradeorderBookHistory',tradeorderhistoryschema);



module.exports.AddTradeHistory=function (TradeorderBookHistory,callback) {
    TradeorderBookHistory.save(callback);
}
