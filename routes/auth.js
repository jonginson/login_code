var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var template = require('../lib/template.js');
const shortid = require('shortid');
var db = require('../lib/db');
const bcrypt = require('bcrypt');

module.exports = function (passport) {
  router.get('/login', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'login';
    var html = template.HTML(title, ' ', `
      <div style="color:red;">${feedback}</div>
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="pwd" placeholder="password"></p>
        <p>
          <input type="submit" value="login">
        </p>
      </form>
    `, '');
    response.send(html);
  });

  router.post('/login_process',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true,
      successFlash: true  
  }));
  
    router.get('/register', function (request, response) {
      var fmsg = request.flash();
      var feedback = '';
      if (fmsg.error) {
        feedback = fmsg.error[0];
      }
      var title = 'register';
      var html = template.HTML(title, ' ', `
        <div style="color:red;">${feedback}</div>
        <form action="/auth/register_process" method="post">
          <p><input type="text" name="email" placeholder="email"></p>
          <p><input type="password" name="pwd" placeholder="password"></p>
          <p><input type="password" name="pwd2" placeholder="password"></p>
          <p><input type="text" name="nickname" placeholder="nickname"></p>
          <p>
            <input type="submit" value="register">
          </p>
        </form>
      `, '');
      response.send(html);
    });

    router.post('/register_process', function (request, response) {
      var post = request.body;
      var email = post.email;
      var pwd = post.pwd;
      var pwd2 = post.pwd2;
      var nickname = post.nickname;
      /*var token = jwt.sign(
        {
          jwt_email : email,
          jwt_pwd : pwd
        },
        "secretkey",
        {
          subject: email + "'s Token",
          expiresIn: "60m",
          issuer: "Jongin"
        }
      );
      */
      if(pwd !== pwd2){
        request.flash('error', 'Password must same!')
        response.redirect('/auth/register')
      } else {
        bcrypt.hash(pwd, 10, function(err, hash){
          var user = {
            id:shortid.generate(),
            email:email,
            password:hash,
            nickname:nickname,
            //accesstoken:token
        }
        db.get('users').push(user).write();
        request.login(user, function(err){
          return response.redirect('/')
        })
    })
    }});
  return router;
}