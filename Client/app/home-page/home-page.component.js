'use strict';

// Register `homePage` component, along with its associated controller and template
angular.
  module('homePage').
  component('homePage', {
    templateUrl: 'home-page/home-page.template.html',
    controllerAs: "homeCtrl",
    controller: ['$http', '$sce', '$location',
      function HomePageController($http, $sce, $location) {
        var self = this;

        //Variaveis
        self.deputados = [{
          "fullname": 'adolfo',
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

      }];

        //Declaracao dos metodos
        self.getPost = getDeputados;
        self.teste = teste;
        //Init deputados list
        getDeputados();
        // teste();

        function getDeputados() {
          const api = 'http://localhost:3000/api/v0/deputados';
          //Busca deputados no servidor
          $http.get(api).then(function(response) {
            if(response.status === 200){
              if(response.data.length > 0){
                self.deputados = response.data;
              }else{
                console.log("Error array vazio");
              }
            }else{
              console.log("Error request, code: "+response.status);
            }
          }, function(response) {
            console.log("Error ");
          });
        };

        function teste() {
          console.log("Eu funciono! ")
        };
      }
    ]
  });
