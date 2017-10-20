# Deputados-federal-info
Node.js, ExpressJS, JSdom, request, Mongodb, Angular, mocha, chai, chai-http, istanbul

## UP & RUNNING
* `git clone` or fork it
### Para o Cliente:
* Go inside of folder Client `cd Client/`
* `npm install`
* `npm start`
* Visit `http://localhost:8080/`

### Para o Server
* Go inside of folder Server `cd Server/`
* `npm install`
* `npm start`
* Api path `http://localhost:3000/api/v0/`

## Routes
* POST     		/deputados          (save deputado in mongodb)    
* GET     		/deputados          (Return array of deputados from mongodb)             
* GET     		/ping               (request to test the server)      	

### Unit test for the server part
Unit test using mocha, chai, chai-http, istanbul
* Go inside of folder Server `cd Server/`
* `npm test`
or
* `npm run coverage`