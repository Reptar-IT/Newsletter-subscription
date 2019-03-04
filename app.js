// jshint esversion:6
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
const xreq = require("request");


const view = __dirname + "/app/views/";
app.use(express.static(__dirname + "/app/public"));

app.get("/", function(req, res){
  res.sendFile(view + "pages/signup.html");
});

app.post("/", function(req, res){
  var fName = req.body.fName;
  var lName = req.body.lName;
  var email = req.body.email;
  var mailChimpApiKey = "";

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        }
      }
    ],
  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us20.api.mailchimp.com/3.0/lists/135e554035",
    method: "POST",
    headers: {
      "Authorization": "coinmancer " + mailChimpApiKey
    },
    body: jsonData,
  };
  xreq(options, function(error, response, body){
    if(error){
      res.sendFile( view + "pages/failure.html");
    } else {
      var status = response.statusCode;
      if(status !== 200){
        res.sendFile( view + "pages/failure.html");
      } else {
        res.sendFile( view + "pages/success.html");
      }

    }
  });
});

app.get("/success", function(req, res){
  res.sendFile(view + "pages/success.html");
});

app.get("/failure", function(req , res){
  res.sendFile(view + "pages/failure.html");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running 3000");
});
