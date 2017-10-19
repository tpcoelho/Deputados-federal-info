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
            var pageSections = dom.window.document.getElementsByClassName('visualNoMarker');
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
            var infoDep = pageSections[0];
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
            var comissoes = pageSections[2].children[0].getElementsByTagName("acronym");
            for (var i = 0; i < comissoes.length; i++) {
                if (i == (comissoes.length-1)) {
                    newDeputado.mainCommission += comissoes[i].innerHTML;
                } else {
                    newDeputado.mainCommission += comissoes[i].innerHTML + ', ';
                }
            }
            //Suplente
            comissoes = pageSections[2].children[1].getElementsByTagName("acronym");
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
            var indexAddress = 4;
            if(pageSections.length > 5){
                //has link to social media
                indexAddress++;
            }
            var endereco = pageSections[indexAddress].getElementsByTagName("li");
            newDeputado.fullAddress.address = endereco[0].innerHTML;
            newDeputado.fullAddress.complement = endereco[1].innerHTML.trim().split("&nbsp")[0];
            newDeputado.fullAddress.CEP = endereco[2].innerHTML;

            salvaDeputado(newDeputado);
        }
    });
}

function salvaDeputado(newDeputado) {
    var options = {
        url: 'http://localhost:3000/api/v0/addDeputado',
        method: 'POST',
        json: true,
        headers: [
          {
            name: 'content-type',
            value: 'application/json'
          }
        ],
        body: {
          deputado: newDeputado
        }
      }
    request(options, function (error, response, body) {
        if (error && response.statusCode != 200) {
            console.log("Ocorreu um erro! code: "+response.statusCode);
            console.log(error);
        }
    });
}

request("http://www2.camara.leg.br/deputados/pesquisa", function (error, response, body) {
    if (!error && response.statusCode == 200) {
        const dom = new JSDOM(body);
        var arraySize = dom.window.document.getElementById('deputado').length;
        for (var i = 1; i < arraySize; i++) {
            var temp = dom.window.document.getElementById('deputado')[i].value;
            parseDeputadoInfo(temp.split("?")[1])
        }
    }
});