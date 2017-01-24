
const options = require('./options');

const Scout = require('zetta-scout');
const si1145 = require('./si1145');
const util = require('util');

const Si1145Scout = module.exports = function(opts) {
    
  // see if any of the options were overridden in the server

  if (typeof opts !== 'undefined') {
    
    // copy all options defined in the server
    for (const key in opts) {
      if (typeof opts[key] !== 'undefined') {
        options[key] = opts[key];
      }
    }
    
  }

  Scout.call(this);
};

util.inherits(Si1145Scout, Scout);

Si1145Scout.prototype.init = function(next) {

  const self = this;

  const Si1145 = new si1145(options);

  const query = this.server.where({name: 'SI1145'});
  
  this.server.find(query, function(err, results) {
    if (results[0]) {
      self.provision(results[0], Si1145, options);
      self.server.info('Provisioned SI1145');
    } else {
      self.discover(Si1145, options);
      self.server.info('Discovered new device SI1145');
    }
  });

  next();

};
