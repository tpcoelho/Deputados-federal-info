process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");

var server = require('../api/server')
// var scrape = require('../api/scrape')

var Deputado = require("../model/deputado");

var should = chai.should();
chai.use(chaiHttp);


describe('Deputado', function() {

    Deputado.collection.drop();
    
    var newDeputado2 = new Deputado({
        fullname: " JOSE ADAIL CARNEIRO SILVA",
        bday: " 11 / 7",
        party: " PP ",
        state : " CE ",
        situation : " Titular",
        phone : "(61) 3215-5335",
        period : "2015 / 2019",
        mainCommission : "CDEICS, CPD, CTUR, CEHIDRIC, CEPENITE, PEC01911, PEC07011, PEC28716, PL372212, PL742006, CEXHIDCE, CEXPRAI, CEXTRRIO",
        substituteCommission : "CSSF, CEREFPOL, PEC30617, PL760617",
        fullAddress : {
            address: "Praça dos Três Poderes - Câmara dos Deputados",
            complement: "Gabinete: 335 - Anexo: IV",
            CEP: "CEP: 70160-900 - Brasília - DF"
        }
    });

    beforeEach(function(done){
        var newDeputado = new Deputado({
            fullname: 'Joao',
            bday: '20/10',
            party: 'PP',
            state: 'SC',
            situation: 'titular',
            phone: '124124',
            period: '20123',
            fullAddress: {
                "address": 'dasdas',
                "complement": 'dasds',
                "CEP": 'dasdas',
            },
            mainCommission: 'dasdasd',
            substituteCommission: 'sd',
        });
        newDeputado.save(function(err) {
            done();
        });
    });

    afterEach(function(done){
        Deputado.collection.drop();
        done();
    });


    it('GET /ping - API simple get to test the server', function(done) {
        chai.request(server)
        .get('/api/v0/ping')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('msg');
            res.body.msg.should.be.a('string');
            res.body.msg.should.be.equal('pong!');
            return done();
        });
    });

    it('GET /deputados - should list ALL deputados on database', function(done) {
        chai.request(server)
        .get('/api/v0/deputados')
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.be.lengthOf(1);
            return done();
        });
    });

    it('POST /deputados - should add a SINGLE deputado on database', function(done) {
        chai.request(server)
        .post('/api/v0/deputados')
        .send({ deputado: newDeputado2 })
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.success.should.be.true;
            res.body.should.have.property('msg');
            res.body.msg.should.be.a('string');
            res.body.msg.should.be.equal('Successfully saved deputado');
            return done();
        });
    });

    it('POST /deputados - No object was send in the body', function(done) {
        chai.request(server)
        .post('/api/v0/deputados')
        .send({ obj: newDeputado2 })
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.success.should.be.false;
            res.body.should.have.property('msg');
            res.body.msg.should.be.a('string');
            res.body.msg.should.be.equal('Objeto deputado não enviado!');
            return done();
        });
    });

    it('POST /deputados - Deputado already exist in the database', function(done) {
        newDeputado2.save(function(err) {
        });

        chai.request(server)
        .post('/api/v0/deputados')
        .send({ deputado: newDeputado2 })
        .end(function(err, res){
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.success.should.be.false;
            res.body.should.have.property('msg');
            res.body.msg.should.be.a('string');
            res.body.msg.should.be.equal('Deputado já está cadastrado');
            return done();
        });
    });

    it('POST /deputados - Deputado has missing fields', function(done) {
        var incompleteDeputado = {
            fullname: " JOSE ADAIL CARNEIRO SILVA",
            bday: " 11 / 7",
            party: " PP ",
            state : " CE "
        }
        chai.request(server)
        .post('/api/v0/deputados')
        .send({ deputado: incompleteDeputado })
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.success.should.be.false;
            res.body.should.have.property('msg');
            res.body.msg.should.be.a('string');
            res.body.msg.should.have.string('Failed to save deputado;');
            return done();
        });
    });
});