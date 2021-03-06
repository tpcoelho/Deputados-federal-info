var Deputado = require('../model/deputado');

var functions = {
    
  addNewDeputado: function(req, res){
      if(!req.body.deputado){
        res.json({success: false, msg: 'Objeto deputado não enviado!'});
      } else {
        Deputado.findOne({
          fullname: req.body.deputado.fullname
        }, function(err, user){
            if (err) throw err;
            
            if(!user) {
              var deputado = Deputado( req.body.deputado );
              deputado.save(function(err, deputado){
                if (err){
                  res.json({success:false, msg:'Failed to save deputado; '+err});
                } else {
                  res.json({success:true, msg:'Successfully saved deputado'});
                }
              })
            } else {
              res.status(400).send({success: false, msg: 'Deputado já está cadastrado'});
            }
        })
      }
    },

    getDeputado: function(req, res){
      Deputado.find({}, function(err, data) {
        if (data) {
            res.json(data);
        } else {
            res.status(403).send({ success: false, msg: 'Erro. ' + err });
        }
      }).sort('fullname');
    },
    ping: function(req, res){
      // res.send("pong!", 200);
      res.status(200).send({msg: "pong!"});
    }
    
}

module.exports = functions;