
/**
 * Created by ABC on 23-03-2017.
 */

var mongoose=require('mongoose');


var userschema=mongoose.Schema({
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    first_name:{
        type:String
    },
    last_name:{
        type:String
    },
    mobile:{
        type:String
    },
    ethpublickey:{
        type:String
    },
    ethbufpvt:{
        type:String
    },
    Ethobj:{
        type:String
    },
    EthbalAvailable:{
        type:Number,
        default:0
    },
    Bankbalance:{
        type:Number,
        default:0
    },
    urole:{
        type:String,
        default:'member'
    },
    isverified:{
        type:String,
        default:'no'
    },
    accounttype:{
        type:String,
       default:'dummy'
    }

});

var User=module.exports=mongoose.model('User',userschema);

module.exports.Creatuser=function (newuser,callback) {
    newuser.save(callback);
}



/**
 * Created by ABC on 17-03-2017.
 */
