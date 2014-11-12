var Device = require('zetta-device');
var util = require('util');

var FonaSIM = module.exports = function() {
  Device.call(this);
  this._serialDevice = arguments[0];

  this.ccid = null;
};
util.inherits(FonaSIM, Device);

FonaSIM.prototype.init = function(config) {

  config
  .name('Adafruit Fona SIM')
  .type('fona-sim')
  .state('waiting')
  .when('waiting', { allow: ['get-ccid']})
  .map('get-ccid', this.getCCID);

};

FonaSIM.prototype.getCCID = function(cb) {
  this.log('getCCID');  

  var self = this;
  
  var tasks = [
  {    
    regexp: /^$/,
    before: function() {self.state = 'getting-ccid'},
    command: 'AT+CCID'
  },
  {
    regexp: /^(\d[a-zA-Z0-9]*)$/,
    onMatch: function(match) {
      self.ccid = match[1];
    }
  },
  {
    regexp: /^$/
  },
  {
    regexp: /OK/,
    onMatch: function () {
      self.state='waiting';
      cb();
    }
  }
  ];

  this._serialDevice.enqueue(tasks, null, function() {});
};
