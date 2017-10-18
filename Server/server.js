// var express = require('express');
//     routes = require('./routes/routes');
//     bodyParser = require('body-parser');


// var app = express();
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
// app.use('/api/v0', routes);

// app.listen(3333, function(){
//     console.log('Server is running');
// })


const request = require('request');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

function parseDeputadoInfo(deputadoId) {
    var options = {
        url: 'http://www.camara.leg.br/internet/Deputado/dep_Detalhe.asp?id=' + deputadoId,
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const dom = new JSDOM(body);
            var temp = dom.window.document.getElementsByClassName('visualNoMarker');
            var newDeputado = {
                "fullname": '',
                "bday": '',
                "party": '',
                "state": '',
                "situation": '',
                "phone": '',
                "period": '',
                "fullAddress": {
                    "address": '',
                    "complement": '',
                    "CEP": '',
                },
                "mainCommission": '',
                "substituteCommission": '',

            }
            var infoDep = temp[0];
            /** O array possui 7 elementos porem so precismos dos 5 primeiros
             * Linha 1 - nome
             * linha 2 - aniversario
             * linha 3 - partido/uf
             * linha 4 - telefone
             * linha 5 - legislatura
             */
            newDeputado.fullname = infoDep.children[0].innerHTML.split("</strong>")[1];
            newDeputado.bday = infoDep.children[1].innerHTML.split("</strong>")[1];

            var linha3 = infoDep.children[2].innerHTML.split("</strong>");
            linha3 = linha3[1].split("/");
            newDeputado.party = linha3[0];
            newDeputado.state = linha3[1];
            newDeputado.situation = linha3[2];

            var linha4 = infoDep.children[3].innerHTML.split("</strong>");
            linha4 = linha4[1].split("- <strong>");
            newDeputado.phone = linha4[0].trim();

            var linha5 = infoDep.children[4].innerHTML.split("</strong>");
            linha5 = linha5[1].trim().split("/");
            newDeputado.period = "20" + linha5[0] + " / 20" + linha5[1];

            /** Minhas informações na Câmera
            * Linha 1 - Titular das  comissões
            * linha 2 - Suplente das  comissões
            */
            var comissoes = temp[2].children[0].getElementsByTagName("acronym");
            for (var i = 0; i < comissoes.length; i++) {
                if (i == (comissoes.length-1)) {
                    newDeputado.mainCommission += comissoes[i].innerHTML;
                } else {
                    newDeputado.mainCommission += comissoes[i].innerHTML + ', ';
                }
            }
            //Suplente
            comissoes = temp[2].children[1].getElementsByTagName("acronym");
            for (var i = 0; i < comissoes.length; i++) {
                if (i == (comissoes.length-1)) {
                    newDeputado.substituteCommission += comissoes[i].innerHTML;
                } else {
                    newDeputado.substituteCommission += comissoes[i].innerHTML + ', ';
                }
            }

             /** Endereço para correspondência
            * Linha 1 - endereco
            * linha 2 - Gabinete
            * linha 3 - Cep
            */
            
            var endereco = temp[4].getElementsByTagName("li");
            newDeputado.fullAddress.address = endereco[0].innerHTML;
            newDeputado.fullAddress.complement = endereco[1].innerHTML.trim().split("&nbsp")[0];
            newDeputado.fullAddress.CEP = endereco[2].innerHTML;

            salvaDeputado(newDeputado);
        }
    });
}

function salvaDeputado() {
    request("http://localhost:3333/api/v0/ping", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);

        }
    });
}

request("http://www2.camara.leg.br/deputados/pesquisa", function (error, response, body) {
    if (!error && response.statusCode == 200) {
        const dom = new JSDOM(body);
        var arraySize = dom.window.document.getElementById('deputado').length;
        arraySize = 2;
        for (var i = 1; i < arraySize; i++) {
            var temp = dom.window.document.getElementById('deputado')[i].value;
            parseDeputadoInfo(temp.split("?")[1])
        }
    }
});