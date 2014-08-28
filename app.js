
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');



var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//Additional functions


var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'cxnvcarol@gmail.com',
        pass: 'quiero2gatos'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails


// send mail with defined transport object
var sendMessage=function(mailOptions){

    var errorMsg='';
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            errorMsg =error;
        }else{
            console.log('Message sent: ' + info.response);
            errorMsg='success';
        }
    });
    return errorMsg;
};


// Routes

app.get('/', routes.index);
app.get('/contact_me', routes.index);
//app.post('/contact_me',routes.contactme);

app.post('/contact_me', function(req, res) {
    console.log(req.body);
    var mailOptions = {
        from: req.body.name+' ✔ <'+req.email+'>', // sender address
        to: 'quot@outlook.es, '+req.email, // list of receivers
        subject: 'Copia mensaje Quot', // Subject line
        //text: 'Aquí vamos' // plaintext body
        //html: JSON.stringify(req.body)
        html: '<b>Nombre:</b> '+req.body.name+'<br/><b>Teléfono: </b>'+req.body.phone+'<br/><b>Email:</b> '+req.body.email+'<br/><br/>'+req.body.message
    };

    var erMes=sendMessage(mailOptions);
    res.send("<h1>Listo ps</h1><p>"+erMes+"</p>")


});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
