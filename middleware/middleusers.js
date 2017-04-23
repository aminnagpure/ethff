var cookie = require('cookie');
var users=require('../models/user');
var jwt=require('jsonwebtoken');
var Q=require('q');

module.exports.islogged=function(req,res,next){

        var defer=Q.defer();

    var jj=cookie.parse(req.headers.cookie);

        if (jj.auth) {
            jwt.verify(jj.auth,'amingandu',function (err,data) {

                if (err) {
                    req.cookies.auth = '';
                    res.locals.layout='layout.hbs';

                    defer.reject('nope');
                    //next();
                    //return res.status(403).send('Error');

                } else {
                    //console.log('in else condition');
                    res.locals.layout='layoutlogedin.hbs';
                   // console.log(data);
                    defer.resolve(data);


     //               next();


                }
            });

        } else{
            res.locals.layout='layout.hbs';

            defer.reject(false);
   //         next();
        }

                //console.log('inside token');
        return defer.promise;




};