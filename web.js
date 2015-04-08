var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express();

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/images", express.static(__dirname + '/images'));
app.use("/fonts", express.static(__dirname + '/fonts'));
app.use("/sounds", express.static(__dirname + '/sounds'));

app.get('/', function(request, response) { var htmlBuffer = fs.readFileSync('index.html', 'utf-8'); response.send(htmlBuffer); });
app.get('/capoeira', function(request, response) { var htmlBuffer = fs.readFileSync('index.html', 'utf-8'); response.send(htmlBuffer); });
app.get('/membership', function(request, response) { var htmlBuffer = fs.readFileSync('index.html', 'utf-8'); response.send(htmlBuffer); });
app.get('/faq', function(request, response) { var htmlBuffer = fs.readFileSync('index.html', 'utf-8'); response.send(htmlBuffer); });
app.get('/email', function(request, response) { var htmlBuffer = fs.readFileSync('index.html', 'utf-8'); response.send(htmlBuffer); });
app.get('/formconfirmation', function(request, response) { var htmlBuffer = fs.readFileSync('index.html', 'utf-8'); response.send(htmlBuffer); });
app.get('/inc_capoeira.html', function(request, response) { var htmlBuffer = fs.readFileSync('inc_capoeira.html', 'utf-8'); response.send(htmlBuffer); });
app.get('/inc_membership.html', function(request, response) { var htmlBuffer = fs.readFileSync('inc_membership.html', 'utf-8'); response.send(htmlBuffer); });
app.get('/inc_faq.html', function(request, response) { var htmlBuffer = fs.readFileSync('inc_faq.html', 'utf-8'); response.send(htmlBuffer); });
app.get('/inc_email.html', function(request, response) { var htmlBuffer = fs.readFileSync('inc_email.html', 'utf-8'); response.send(htmlBuffer); });
app.get('/inc_formconfirmation.html', function(request, response) { var htmlBuffer = fs.readFileSync('inc_formconfirmation.html', 'utf-8'); response.send(htmlBuffer); });

app.post('/inc_email.html', function(request, response) {
  var name = request.body.name;
  var email = request.body.email;
  var mobile = request.body.mobile;
  var medical = request.body.medical;
  var background = request.body.background;
  var validation = request.body.validation;
  var out = 'contact name: ' + name 
          + '\ncontact email: ' + email 
          + '\nmobile: ' + mobile 
          + '\nmessage: ' + message
          + '\nvalidation: ' + validation 
          + '\n';
    var options = {
      host: 'api.postmarkapp.com',
      port: 80,
      path: '/email',
      method: 'POST',
      headers: { 
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-postmark-server-token': 'f2392957-2e91-4ace-9f07-a72da382dd4c'
      }
    };

    var req = http.request(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write("{From: 'munair@quilombola.com', To: 'munair@gmail.com', Subject: 'Postmark test', HtmlBody: '<html><body><strong>Hello</strong> dear Postmark user.</body></html>'}");
    req.end();

    response.redirect('/inc_formconfirmation.html');
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
