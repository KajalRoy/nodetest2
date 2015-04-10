var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/wait', function(req, res) {
    res.render('home', { title: 'Employee DataBase' , heading: 'Sign In to our DataBase', message: 'Wait few hours, before your list is update'});
});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('home', { title: 'Employee DataBase' , heading: 'Sign In to our DataBase'});
});

/* GET SignUp page */
router.get('/signup', function(req, res){
	res.render('signup', { title: 'Employee Registration' });
});

/*GET User page*/
router.post('/login', function(req, res){
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.body.username==='' || req.body.password===''){
    console.log('null value');
    res.render('home', {heading: 'Sign In to our DataBase', message: 'Please provide missing field'});
  }else if(req.body.username==='admin' && req.body.password==='admin'){
    console.log('admin rights');
		req.session.regenerate(function(error) {
      		if (error) {
        		console.log(error);
      		} else {
        		req.session.username = req.body.username;
        		res.render('index', { title: 'Employee Registration' });
      		}
    	});
	}
	else
	{

		// var db = req.db;
    //	db.collection('user').findOne({username:req.body.username, password:req.body.password}, function (err, items) {
      request.get('http://localhost:8080/rest/emps/'+req.body.username+'/'+req.body.password, function (err, items) {
        
        if(err) return next(err);
        else{
        	if(items.body==='null') res.render('home', {heading: 'Mismatch, Re-Login!'});
        	else{
        		req.session.regenerate(function(error) {
      				if (error) {
        				console.log(error);
      				} else {
        				req.session.username = req.body.username;
        				res.render('user', { user: items.body});
      				}
    			});
        	}
  
    	}
    	});
	}
});

router.get('/logout', function(req, res){
	req.session.destroy(function(error) {
    	if (error) {
      		console.log(error);
    	} else {
      		res.redirect('/');
    	}
  	});
});

/*
router.get('*', function(req, res){
	res.writeHead(200, {'content-type':'text/plain'});
	res.write('Page not found');
	res.end();
});
*/


module.exports = router;
