var Scout = require('zetta-scout');
var util = require('util');
var FonaSIM = require('./fona_sim');

var FonaSIMScout = module.exports = function() {
  Scout.call(this);
};
util.inherits(FonaSIMScout, Scout);

FonaSIMScout.prototype.init = function(next) {
  var FonaSIMQuery = this.server.where({type: 'fona-sim'});
  var serialDeviceQuery = this.server.where({ type: 'serial' });
  
  var self = this;

  this.server.observe(serialDeviceQuery, function(serialDevice) {
    self.server.find(FonaSIMQuery, function(err, results) {
      if (results[0]) {
        self.provision(results[0], FonaSIM, serialDevice);
      } else {
        self.discover(FonaSIM, serialDevice);
      }
      next();
    });
  });
}
