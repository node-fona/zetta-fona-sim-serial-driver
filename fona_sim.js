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
  .when('waiting', { allow: ['get-ccid', 'unlock-sim']})
  .map('unlock-sim', this.unlockSIM, [
    { name: 'pin', title: 'SIM PIN', type: 'text'}
    ])
  .map('get-ccid', this.getCCID);

};

FonaSIM.prototype.getCCID = function(cb) {
  this.log('getCCID');  

  var self = this;
  
  var tasks = [
  {    
    before: function() {self.state = 'getting-ccid'},
    command: 'AT+CCID',
    regexp: /^$/
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

FonaSIM.prototype.unlockSIM = function(pin, cb) {
  this.log('unlockSIM');  

  var self = this;
  
  var tasks = [
  {    
    command: 'AT+CPIN=' + pin,
    regexp: /^$/,
    before: function() {self.state = 'unlocking-sim'},
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
