// app/routes.js
var mongoose = require('mongoose');
var User = mongoose.model('User');

var gravatar = require('gravatar');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', isLoggedIn, function(req, res) {
        res.redirect('/eutech/edds'); // redirect to edds/index.ejs file
    });

    app.get('/users', function(req, res) {

        // render the page and pass in any flash data if it exists
        User.find({}, function(err, users){
          if(err)
            res.send(err);
          res.render('user/list.ejs', { users: users });
        });

    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('user/login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('user/signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        //res.render('profile.ejs', {
        //    user : req.user // get the user out of session and pass to template
        //});
        res.render('user/profile.ejs',{user: req.user});
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/login', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


        // app/routes.js
    app.post('/users/delete/:userId', function(req, res){
      User.remove({_id: req.params.userId}, function(err, user){
        //res.render('user/list.ejs', { message: req.flash('deleteUserMessage') })
        res.redirect('/users');
      });
    });
    app.get('/users/editProfile/:userId', function(req, res){
      User.findOne({_id: req.params.userId}, function(err, userProfile){
        //res.render('user/list.ejs', { message: req.flash('deleteUserMessage') })
        if(userProfile.local.gravatar)
          userProfile.local.gravatar = userProfile.local.gravatar.substr(26, 32);
        res.render('user/editProfile.ejs', {userProfile: userProfile});
      });
    });
    app.get('/users/edit/:userId', function(req, res){
      User.findOne({_id: req.params.userId}, function(err, userProfile){
        //res.render('user/list.ejs', { message: req.flash('deleteUserMessage') })
        if(userProfile.local.gravatar)
          userProfile.local.gravatar = userProfile.local.gravatar.substr(26, 32);
        res.render('user/edit.ejs', {userProfile: userProfile});
      });
    });
    app.post('/users/update/:userId', function(req, res){
      console.log("Update user => " + req.params.userId);
      User.findOne({_id: req.params.userId}, function(err, userProfile){
        //res.render('user/list.ejs', { message: req.flash('deleteUserMessage') })
        //console.log("Update current user => " + user.local.firstname + ", " +  user.local.lastname + ", " + user.local.password);
        //console.log("with user => " + req.body.firstname + ", " +  req.body.lastname + ", " + req.body.password + ", " + req.body._admin + ", " + req.body.staff + ", " + req.body.validator + ", " + req.body.user);
        if(userProfile.local.firstname != req.body.firstname)
        {
          console.log("User's firstname changed from " + userProfile.local.firstname + " to " + req.body.firstname);
          userProfile.local.firstname = req.body.firstname;
        }
        if(userProfile.local.lastname != req.body.lastname)
        {
          console.log("User's lastname changed from " + userProfile.local.lastname + " to " + req.body.lastname);
          userProfile.local.lastname = req.body.lastname;
        }

        userProfile.local.gravatar = gravatar.url(userProfile.local.email);

        /*if(!user.validPassword(req.body.password))
        {
          console.log("User's password changed!");
          user.local.password = user.generateHash(req.body.password);
        }*/
        userProfile.local.admin = (req.body.admin) ? true : false;
        userProfile.local.staff = (req.body.staff) ? true : false;
        userProfile.local.validator = (req.body.validator) ? true : false;
        userProfile.local.user = (req.body.user) ? true : false;
        userProfile.save(function(err){
          if(err)
            throw err;
          res.redirect('/users');
        });
      });
    });

    app.post('/users/updateProfile/:userId', function(req, res){
      console.log("Update user => " + req.params.userId);
      User.findOne({_id: req.params.userId}, function(err, userProfile){
        //res.render('user/list.ejs', { message: req.flash('deleteUserMessage') })
        //console.log("Update current user => " + user.local.firstname + ", " +  user.local.lastname + ", " + user.local.password);
        //console.log("with user => " + req.body.firstname + ", " +  req.body.lastname + ", " + req.body.password + ", " + req.body._admin + ", " + req.body.staff + ", " + req.body.validator + ", " + req.body.user);
        if(userProfile.local.firstname != req.body.firstname)
        {
          console.log("User's firstname changed from " + userProfile.local.firstname + " to " + req.body.firstname);
          userProfile.local.firstname = req.body.firstname;
        }
        if(userProfile.local.lastname != req.body.lastname)
        {
          console.log("User's lastname changed from " + userProfile.local.lastname + " to " + req.body.lastname);
          userProfile.local.lastname = req.body.lastname;
        }
        /*if(req.body.gravatar)
        {
          console.log("User's gravatar email hash => " + req.body.gravatar);
          userProfile.local.gravatar = "//www.gravatar.com/avatar/" + req.body.gravatar;
        }*/
        userProfile.local.gravatar = gravatar.url(userProfile.local.email);
        /*if(!user.validPassword(req.body.password))
        {
          console.log("User's password changed!");
          user.local.password = user.generateHash(req.body.password);
        }*/
        //userProfile.local.admin = (req.body.admin) ? true : false;
        //userProfile.local.staff = (req.body.staff) ? true : false;
        //userProfile.local.validator = (req.body.validator) ? true : false;
        //userProfile.local.user = (req.body.user) ? true : false;
        //userProfile.validPassword()
        userProfile.save(function(err){
          if(err)
            throw err;
          res.redirect('/profile');
        });
      });
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
        console.log("User " + req.user.local.email + " has logged in...");
        return next();
      }

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
