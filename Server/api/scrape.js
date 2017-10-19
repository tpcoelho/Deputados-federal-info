const request = require('request');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

//Comeca buscando os 10 primeiros deputados
const incresseSearch = 10;

var indexSearchBegin = 1;
var indexSearchEnd = indexSearchBegin+incresseSearch;

var resetaIndex = false;

/**
 * Excuta o @metodo getDeputado a cada 10 segundos\
 */
setInterval(getDeputado, 10*1000); //time is in ms
function getDeputado(){
    console.log("Info status running: indexBegin = "+indexSearchBegin+" ## indexEnd = "+indexSearchEnd);

    request("http://www2.camara.leg.br/deputados/pesquisa", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const dom = new JSDOM(body);
            var arraySize = dom.window.document.getElementById('deputado').length;
            for (var i = indexSearchBegin; i < indexSearchEnd; i++) {
                //Seleciona a comboBox com a lista de deputados
                var temp = dom.window.document.getElementById('deputado')[i].value;
                //Pesquisa o deputdo pela sua id
                parseDeputadoInfo(temp.split("?")[1])
            }
            //Controla pra ver se o array ja chegou ate o final
            if(!resetaIndex){
                indexSearchBegin += incresseSearch;
                indexSearchEnd += incresseSearch;
                // Se o index for maior que o tamanho do array, significa que chegou no final.
                // Vai executar mais uma vez e resetar os contadores.
                if(indexSearchEnd > arraySize){
                    indexSearchEnd = arraySize;
                    resetaIndex = true;
                }
            }else{
                indexSearchBegin = 1;
                indexSearchEnd = indexSearchBegin+incresseSearch;
                resetaIndex = false;
            }
        }
    });
}

/**
 * Pesquisa o deputado pela id e monta um objeto JSON com as informacao obtidas na pagina HTML
 * @param {Number} deputadoId 
 */
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
            //JSON exemplo
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

/**
 * Recebe um obj JSON e faz uma chamada para a API do server para salvar o obj no mongodb
 * @param {JSONObject} newDeputado 
 */
function salvaDeputado(newDeputado) {
    var options = {
        url: 'http://localhost:3000/api/v0/deputados',
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