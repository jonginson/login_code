var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');

router.get('/', function (request, response) {
  var fmsg = request.flash();
  var feedback = '';
  if(fmsg.success){
    feedback = fmsg.success[0];
  }
  var title = 'Welcome';
  var description = ' ';
  var html = template.HTML(title, description,"<hr></hr>"," "
  );
  response.send(html);
});

module.exports = router;