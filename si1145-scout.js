const config = require('./config');

const Scout = require('zetta-scout');
const Si1145 = require('./si1145');

module.exports = class Si1145Scout extends Scout {

  constructor(opts) {

    super();

    if (typeof opts !== 'undefined') {
      // copy all config options defined in the server
      for (const key in opts) {
        if (typeof opts[key] !== 'undefined') {
          config[key] = opts[key];
        }
      }
    }

    if (config.name === undefined) { config.name = "SI1145" }
    this.name = config.name;

    this.si1145 = new Si1145(config);

  }

  init(next) {
    const query = this.server.where({name: this.name});
  
    const self = this;

    this.server.find(query, function(err, results) {
      if (!err) {
        if (results[0]) {
          self.provision(results[0], self.si1145);
          self.server.info('Provisioned known device ' + self.name);
        } else {
          self.discover(self.si1145);
          self.server.info('Discovered new device ' + self.name);
        }
      }
      else {
        self.server.error(err);
      }
    });

    next();
  }

}
