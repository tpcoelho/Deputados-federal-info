const express = require('express');
    routes = require('../routes/routes');
    config = require('../config/database');
    mongoose = require('mongoose');
    bodyParser = require('body-parser');
    morgan = require('morgan');

mongoose.connect(config.database);

//If mongo is up, start the server
mongoose.connection.on('open', function(){
    console.log('Mongo is connected');
    var server = express();
    server.use(bodyParser.urlencoded({extended: false}));
    // create application/json parser
    server.use(bodyParser.json());
    //Routes
    server.use('/api/v0', routes);
    // HTTP request logger middleware for node.js
    server.use(morgan('dev'));

    var port = process.env.PORT || 3000
    server.set('port', port);
    server.listen(server.get('port'), function(){
        console.log(`Server is running on port ${port}`);
    })
})
