var express = require('express');
    routes = require('./routes/routes');
    bodyParser = require('body-parser');

 
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api/v0', routes);

app.listen(3333, function(){
    console.log('Server is running');
})
