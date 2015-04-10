var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');


router.post('/upload', function(req, res) {
    //console.log("the uploaded fileName");
    //console.log(req.files);
    if(req.files){
        fs.readFile(req.files.myFile.path, function (err, data) {
            var newPath = './uploads/uploadedUsersList.csv';
            fs.rename(req.files.myFile.path, newPath, function (err) {
            res.redirect('/wait');
            var spawn = require('child_process').spawn;
            var deploySh = spawn('/Users/kajroy/Documents/node/nodetest2/data/batchScript/backgroundUpload.sh', [ '/Users/kajroy/Documents/node/nodetest2/uploads/uploadedUsersList.csv' ]);
            });
        });
    }
});


/*
 * GET userlist.
 */
router.get('/userlist/:page', function(req, res) {
    /*
    var db = req.db;
    db.collection('userlist').find().toArray(function (err, items) {
        if(err) return next(err);
        res.json(items);
    });
    */
    request.get('http://localhost:8080/rest/emps/'+req.params.page, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        if(body == '[]'){
            res.json(null);
        }else{
        var items = JSON.parse(body);
        //console.log(items);
        res.json(items);
        }
     }
});

});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    /*
    var db = req.db;
    db.collection('userlist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
    */
    request.post({url: "http://localhost:8080/rest/emp/create", headers: {"Content-Type": "application/json"}, body: JSON.stringify(req.body)}, function(err, result, body) {
        console.log(body);
        if(err === null){
            if(body === 'duplictae') res.send({msg: 'duplictae'});
            else res.send({msg: ''})
        }
        else{
            res.send({msg: err});
        }

    });

});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
    /*
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('userlist').removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
    */

    request.del('http://localhost:8080/rest/emp/delete/'+req.params.id, function(err, result) {
        res.send((err === null) ? { msg: '' } : { msg: err });
    });

});

router.put('/updateuser/:id', function(req, res) {
    /*
    var mongo = require('mongoskin');
    var db = req.db;
    //var userToUpdate = mongo.helper.toObjectID(req.params.id);
    db.collection('userlist').update({_id: mongo.helper.toObjectID(req.params.id)}, {$set: req.body}, function(e, result){
        res.send((result===1)?{msg:''}:{msg: e+': UNABLE TO UPDATE'})
    });
    */
    var url = 'http://localhost:8080/rest/emp/update/'+req.params.id;
    console.log(req.body.email);
    if(req.body.email){
        url += '/1'
    }else{
        url +='/0'
    };
    console.log(req.body.location);
    if(req.body.location){
        url += '/1'
    }else{
        url +='/0'
    };
    console.log(req.body.password);
    if(req.body.password){
        url += '/1'
    }else{
        url +='/0'
    };
    console.log(url);
    request.put({url: url,headers: {'Content-Type': 'application/json'}, body: JSON.stringify(req.body)}, function(err, result) {
        res.send((err === null) ? { msg: '' } : { msg: err });
    });
});


module.exports = router;
