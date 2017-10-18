var functions = {
    
    ping: function(req, res){
      // res.send("pong!", 200);
      res.status(200).send("pong!");
    }
    
}

module.exports = functions;